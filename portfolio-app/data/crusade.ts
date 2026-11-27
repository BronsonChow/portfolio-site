export type Weapon = {
  Name: string;
  Abilities: string[] | null;
  Range: number | "Melee";
  A: number | string;
  BS: number;
  S: number;
  AP: number | string;
  D: number | string;
};

// free-text entry (placeholder wargear / ability descriptions)
export type Note = { Desc: string };

export type Unit = {
  id: number;
  name: string;
  movement: number;
  toughness: number;
  save: number;
  invuln_save: number | null;
  wounds: number;
  wargear?: (Weapon | Note)[];
  abilities?: Note[];
};

export function is_weapon(entry: Weapon | Note): entry is Weapon {
  return "Name" in entry;
}

export const sample_units: Unit[] = [
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
        Name: "OP Lasers",
        Abilities: ["Ability 1", "Ability 2"],
        Range: 12,
        A: 20,
        BS: 2,
        S: 50,
        AP: "-3",
        D: "2d6",
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