// data/crusade.js: plain-JS copy of portfolio-app/data/crusade.ts.
// Plain JS (not .ts) so Vercel imports it without any TypeScript step.
// The types live in JSDoc comments so editors still check them.
// Keep this in sync with portfolio-app/data/crusade.ts.

/**
 * @typedef {object} Weapon
 * @property {string} Name
 * @property {string[] | null} Abilities
 * @property {number | "Melee"} Range
 * @property {number | string} A
 * @property {number} BS
 * @property {number} S
 * @property {number | string} AP
 * @property {number | string} D
 */

/**
 * Free-text entry (placeholder wargear / ability descriptions).
 * @typedef {{ Desc: string }} Note
 */

/**
 * @typedef {object} Unit
 * @property {number} id
 * @property {string} name
 * @property {number} movement
 * @property {number} toughness
 * @property {number} save
 * @property {number | null} invuln_save
 * @property {number} wounds
 * @property {(Weapon | Note)[]} [wargear]
 * @property {Note[]} [abilities]
 */

/**
 * @param {Weapon | Note} entry
 * @returns {entry is Weapon}
 */
export function is_weapon(entry) {
  return "Name" in entry;
}

/** @type {Unit[]} */
export const sample_units = [
  {
    id: 8000,
    name: "Gundam RX-93 v Nu",
    movement: 4,
    toughness: 16,
    save: 3,
    invuln_save: 4,
    wounds: 20,
    wargear: [
      {
        Name: "Fin Funnels",
        Abilities: ["Ability 1", "Ability 2"],
        Range: 12,
        A: 6,
        BS: 2,
        S: 50,
        AP: "-3",
        D: "1d20",
      },
      {
        Name: "Punch",
        Abilities: null,
        Range: "Melee",
        A: 1,
        BS: 5,
        S: 10,
        AP: 0,
        D: 1,
      },
    ],
    abilities: [
      { Desc: "Ability 1" },
      { Desc: "Ability 2" },
    ],
  },
  {
    id: 8001,
    name: "Gundam RX-0 Unicorn",
    movement: 8,
    toughness: 20,
    save: 2,
    invuln_save: 3,
    wounds: 10,
    wargear: [
      { Desc: "Weapon stats & abilities go here." },
    ],
  },
  {
    id: 8002,
    name: "Average guy",
    movement: 2,
    toughness: 1,
    save: 6,
    invuln_save: null,
    wounds: 1,
    wargear: [
      { Desc: "He's just an average guy." },
    ],
  },
];