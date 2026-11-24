"use client";

import { useId, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook } from "@fortawesome/free-solid-svg-icons";
import type { Unit } from "@/data/crusade";

const styles = {
  // hero
  hero: "my-sheet-gutter w-full bg-background/75 py-sheet-gutter text-center",
  hero_title: "text-title leading-tight font-normal tracking-tight",
  hero_paragraph: "mt-2 w-full bg-accent/60 px-2 text-hero-paragraph",

  // card container
  sheet: "mx-auto mb-sheet-gutter w-[95%] max-w-sheet-width border-2 bg-navbar",
  sheet_heading: "p-cell-padding text-sheet-heading font-semibold",
  empty: "border-t p-cell-padding text-muted-foreground",

  // rows (header + units share the same columns)
  row: "flex border",
  header_row: "flex bg-accent font-semibold",
  // column sizes come from --spacing-name-column / -toggle-column / -stat-column in layout.css
  name: "min-w-0 grow basis-name-column p-cell-padding text-unit-name [overflow-wrap:anywhere]",
  toggle_spacer: "w-toggle-column shrink-0",
  toggle:
    "flex w-toggle-column shrink-0 cursor-pointer items-center justify-center p-cell-padding transition-colors hover:text-icon-button focus-visible:outline-2 focus-visible:outline-ring aria-expanded:text-icon-button",
  toggle_icon: "size-toggle-book",
  stat: "min-w-0 grow-0 shrink basis-stat-column text-center text-stat [overflow-wrap:anywhere]",
  stat_cell: "border-l",

  // expanding details panel
  details: "grid transition-[grid-template-rows] duration-200 ease-in-out",
  details_open: "grid-rows-[1fr] border border-t-0",
  details_closed: "grid-rows-[0fr]",
  details_inner: "min-h-0 overflow-hidden",
  details_text: "p-2",
};

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
        <h2 className={styles.hero_title}>10th Edition</h2>
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
          <p className={styles.details_text}>{unit.details ?? `Details for ${unit.name}`}</p>
        </div>
      </div>
    </li>
  );
}
