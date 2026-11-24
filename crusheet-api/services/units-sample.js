// services/units-sample.js: the cook, using the sample_units array in memory.
// Same function names and same answers as the Supabase version,
// so the routes cannot tell the difference.
//
// Heads up: on Vercel this array starts fresh whenever Vercel starts a new copy
// of the API, so units you add here will not stick around. Supabase fixes that.

import { sample_units } from "../data/crusade.js";

// Deep copy, so edits here never touch the original array.
let units = structuredClone(sample_units);
let nextId = Math.max(0, ...units.map((unit) => unit.id)) + 1;

// Drop user_id on the way out, like the Supabase version does.
const strip = ({ user_id, ...unit }) => unit;

export async function listUnits() {
  return units.map(strip);
}

export async function getUnit(id) {
  const unit = units.find((u) => u.id === id);
  return unit ? strip(unit) : null;
}

export async function createUnit(unit) {
  const saved = { id: nextId++, ...unit };
  units.push(saved);
  return strip(saved);
}

export async function deleteUnit(id, userId) {
  const before = units.length;
  units = units.filter((unit) => !(unit.id === id && unit.user_id === userId));
  return units.length < before;
}
