export type Unit = {
  id: number;
  name: string;
  movement: number;
  toughness: number;
  save: number;
  invuln_save: number | null;
  wounds: number;
  details?: string;
};

export const placeholder_units: Unit[] = [
  {
    id: -1,
    name: "unit-name",
    movement: 99,
    toughness: 99,
    save: 99,
    invuln_save: 99,
    wounds: 99,
  },
];
