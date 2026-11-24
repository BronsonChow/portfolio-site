"use client";

import { useId, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook } from "@fortawesome/free-solid-svg-icons";
import { is_weapon, type Note, type Unit, type Weapon } from "@/data/crusade";

const styles = {
  // hero
  hero: "my-sheet-gutter w-full bg-background/(--hero-opacity) py-sheet-gutter text-center",
  hero_title: "font-hero-title text-hero-title leading-tight font-normal tracking-tight",
  hero_subtitle: "font-hero-subtitle text-hero-subtitle leading-tight font-normal tracking-tight",
  hero_paragraph:
    "mt-hero-paragraph-gap w-full bg-accent/(--hero-paragraph-opacity) px-hero-paragraph-padding font-hero-paragraph text-hero-paragraph",

  // card container
  sheet: "mx-auto mb-sheet-gutter w-sheet-width-mobile max-w-sheet-width border-sheet bg-navbar",
  sheet_heading: "p-cell-padding font-sheet-heading text-sheet-heading font-semibold",
  empty: "border-cell-t p-cell-padding text-muted-foreground",

  // rows (header + units share the same columns)
  // top divider only: the sheet's own border covers the outer edges
  row: "flex border-cell-t",
  header_row: "flex bg-accent font-semibold",
  // column sizes come from --spacing-name-column / -toggle-column / -stat-column in layout.css
  name: "min-w-0 grow basis-name-column p-cell-padding font-unit-name text-unit-name [overflow-wrap:anywhere]",
  toggle_spacer: "w-toggle-column shrink-0",
  toggle:
    "flex w-toggle-column shrink-0 cursor-pointer items-center justify-center p-cell-padding transition-colors hover:text-icon-button focus-visible:outline-2 focus-visible:outline-ring aria-expanded:text-icon-button",
  toggle_icon: "size-toggle-book",
  stat: "min-w-0 grow-0 shrink basis-stat-column text-center font-stat text-stat [overflow-wrap:anywhere]",
  stat_cell: "border-cell-l",

  // expanding details panel
  // open/close animation + divider timing live in borders.css (details-panel-*)
  details: "grid",
  details_open: "details-panel-open",
  details_closed: "details-panel-closed",
  // colours: --details-* in globals.css; type: --text-details* / --text-weapon-* in typography.css
  details_inner: "min-h-0 overflow-hidden bg-details-background text-details-foreground",
  details_text: "p-details-padding font-details text-details",
  abilities: "border-cell-t",
  details_heading: "px-details-padding pt-details-padding font-details-heading text-details-heading font-semibold",
  details_list: "list-disc px-details-padding pb-details-padding pl-8 font-details text-details",

  // wargear table inside the details panel (flush with the panel edges)
  table_wrap: "overflow-x-auto",
  // column widths come from --spacing-weapon-*-column in layout.css
  table: "w-full min-w-weapon-table-min table-fixed border-collapse",
  th: "bg-accent p-cell-padding text-center font-weapon-header text-weapon-header font-semibold",
  th_name: "bg-accent p-cell-padding text-left font-weapon-header text-weapon-header font-semibold",
  td: "border-cell-t border-cell-l p-cell-padding text-center font-weapon-stat text-weapon-stat",
  td_name: "border-cell-t p-cell-padding text-left font-weapon-name text-weapon-name font-normal",
  weapon_abilities: "block font-weapon-abilities text-weapon-abilities text-details-muted-foreground",
};

// width classes are written out in full so Tailwind can find them
const weapon_columns = [
  { label: "Range", title: "Range", width: "w-weapon-range-column" },
  { label: "A", title: "Attacks", width: "w-weapon-a-column" },
  { label: "BS/WS", title: "Ballistic / Weapon Skill", width: "w-weapon-bs-column" },
  { label: "S", title: "Strength", width: "w-weapon-s-column" },
  { label: "AP", title: "Armour Penetration", width: "w-weapon-ap-column" },
  { label: "D", title: "Damage", width: "w-weapon-d-column" },
];

function format_weapon(w: Weapon) {
  return [
    w.Range === "Melee" ? "Melee" : `${w.Range}"`,
    `${w.A}`,
    `${w.BS}+`,
    `${w.S}`,
    `${w.AP}`,
    `${w.D}`,
  ];
}

const stat_columns = [
  { label: "M", title: "Movement" },
  { label: "T", title: "Toughness" },
  { label: "Sv", title: "Save" },
  { label: "SvI", title: "Invulnerable Save" },
  { label: "W", title: "Wounds" },
];

function format_stats(unit: Unit) {
  return [
    `${unit.movement}"`,
    `${unit.toughness}`,
    `${unit.save}+`,
    unit.invuln_save === null ? "-" : `${unit.invuln_save}+`,
    `${unit.wounds}`,
  ];
}

export default function CrusadeSheet({ units }: { units: Unit[] }) {
  return (
    <>
      <section className={styles.hero}>
        <h1 className={styles.hero_title}>Warhammer 40,000 Crusade Sheet</h1>
        <h2 className={styles.hero_subtitle}>10th Edition</h2>
        <p className={styles.hero_paragraph}>
          The purpose of this site is to <em>hopefully</em> reduce the billions of open tabs of Wahapedia.
        </p>
      </section>

      <section className={styles.sheet} aria-labelledby="army-heading">
        <h2 id="army-heading" className={styles.sheet_heading}>Local Army Datasheet</h2>

        <div className={styles.header_row}>
          <span className={styles.name}>Name</span>
          <span className={styles.toggle_spacer} />
          {stat_columns.map((col) => (
            <abbr key={col.label} title={col.title} className={`${styles.stat} no-underline`}>
              {col.label}
            </abbr>
          ))}
        </div>

        {units.length === 0 ? (
          <p className={styles.empty}>No units yet.</p>
        ) : (
          <ul>
            {units.map((unit) => (
              <UnitRow key={unit.id} unit={unit} />
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

function UnitRow({ unit }: { unit: Unit }) {
  const [open, set_open] = useState(false);
  const details_id = useId();

  return (
    <li>
      <div className={styles.row}>
        <h3 className={styles.name}>{unit.name}</h3>
        <button
          type="button"
          className={styles.toggle}
          onClick={() => set_open(!open)}
          aria-expanded={open}
          aria-controls={details_id}
          aria-label={`${open ? "Hide" : "Show"} details for ${unit.name}`}
        >
          <FontAwesomeIcon icon={faBook} className={styles.toggle_icon} />
        </button>
        {format_stats(unit).map((value, i) => (
          <span key={stat_columns[i].label} className={`${styles.stat} ${styles.stat_cell}`}>
            {value}
          </span>
        ))}
      </div>

      <div
        id={details_id}
        className={`${styles.details} ${open ? styles.details_open : styles.details_closed}`}
        inert={!open}
      >
        <div className={styles.details_inner}>
          <UnitDetails unit={unit} />
        </div>
      </div>
    </li>
  );
}

function UnitDetails({ unit }: { unit: Unit }) {
  const wargear = unit.wargear ?? [];
  const weapons = wargear.filter(is_weapon);
  const notes = wargear.filter((entry): entry is Note => !is_weapon(entry));
  const abilities = unit.abilities ?? [];

  if (wargear.length === 0 && abilities.length === 0) {
    return <p className={styles.details_text}>No details for {unit.name}.</p>;
  }

  return (
    <>
      {weapons.length > 0 && (
        <div className={styles.table_wrap}>
          <table className={styles.table}>
            <caption className="sr-only">Wargear for {unit.name}</caption>
            <colgroup>
              <col />
              {weapon_columns.map((col) => (
                <col key={col.label} className={col.width} />
              ))}
            </colgroup>
            <thead>
              <tr>
                <th scope="col" className={styles.th_name}>Weapon</th>
                {weapon_columns.map((col) => (
                  <th key={col.label} scope="col" className={styles.th}>
                    <abbr title={col.title} className="no-underline">{col.label}</abbr>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {weapons.map((w) => (
                <tr key={w.Name}>
                  <th scope="row" className={styles.td_name}>
                    {w.Name}
                    {w.Abilities && w.Abilities.length > 0 && (
                      <span className={styles.weapon_abilities}>[{w.Abilities.join(", ")}]</span>
                    )}
                  </th>
                  {format_weapon(w).map((value, i) => (
                    <td key={weapon_columns[i].label} className={styles.td}>{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {notes.map((note, i) => (
        <p key={i} className={styles.details_text}>{note.Desc}</p>
      ))}

      {abilities.length > 0 && (
        // divider only when wargear sits above it
        <div className={wargear.length > 0 ? styles.abilities : undefined}>
          <h4 className={styles.details_heading}>Abilities</h4>
          <ul className={styles.details_list}>
            {abilities.map((a, i) => (
              <li key={i}>{a.Desc}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
