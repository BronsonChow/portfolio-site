// middleware/validate.js: bouncers that check a request before the route runs.
// The shapes come from the Unit, Weapon and Note types in data/crusade.js.

// /api/units/7 is fine. /api/units/two is not.
export function checkId(req, res, next) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(404).json({ error: `No unit with id "${req.params.id}"` });
  }
  req.unitId = id;
  next();
}

const isText = (value) => typeof value === "string" && value.trim() !== "";
const isWhole = (value, min) => Number.isInteger(value) && value >= min;
// A, AP and D can be a number (2) or dice/text ("2d6", "-3").
const isStat = (value) => (typeof value === "number" && Number.isFinite(value)) || isText(value);

// Returns a clean Note or Weapon, or an error message string.
function checkWargear(entry, i) {
  if (entry === null || typeof entry !== "object" || Array.isArray(entry)) {
    return `wargear[${i}] must be an object`;
  }

  // Note: { Desc }
  if (!("Name" in entry)) {
    if (!isText(entry.Desc)) return `wargear[${i}] needs a Name (weapon) or a Desc (note)`;
    return { Desc: entry.Desc.trim() };
  }

  // Weapon: { Name, Abilities, Range, A, BS, S, AP, D }
  const { Name, Abilities = null, Range, A, BS, S, AP, D } = entry;
  if (!isText(Name)) return `wargear[${i}].Name is required`;
  if (Abilities !== null && !(Array.isArray(Abilities) && Abilities.every(isText))) {
    return `wargear[${i}].Abilities must be a list of words or null`;
  }
  if (!(Range === "Melee" || isWhole(Range, 1))) {
    return `wargear[${i}].Range must be a whole number greater than 0 or "Melee"`;
  }
  if (!isWhole(BS, 1)) return `wargear[${i}].BS must be a whole number greater than 0`;
  if (!isWhole(S, 1)) return `wargear[${i}].S must be a whole number greater than 0`;
  for (const [key, value] of Object.entries({ A, AP, D })) {
    if (!isStat(value)) return `wargear[${i}].${key} must be a number or text like "2d6"`;
  }

  return {
    Name: Name.trim(),
    Abilities: Abilities === null ? null : Abilities.map((a) => a.trim()),
    Range,
    A: typeof A === "string" ? A.trim() : A,
    BS,
    S,
    AP: typeof AP === "string" ? AP.trim() : AP,
    D: typeof D === "string" ? D.trim() : D,
  };
}

// A new unit needs a name and its stat line. wargear and abilities are optional.
export function validateUnit(req, res, next) {
  const {
    name,
    movement,
    toughness,
    save,
    invuln_save = null,
    wounds,
    wargear = [],
    abilities = [],
  } = req.body ?? {};

  if (!isText(name)) return res.status(400).json({ error: "name is required" });
  if (!isWhole(movement, 0)) {
    return res.status(400).json({ error: "movement must be a whole number, 0 or more" });
  }
  for (const [key, value] of Object.entries({ toughness, save, wounds })) {
    if (!isWhole(value, 1)) {
      return res.status(400).json({ error: `${key} must be a whole number greater than 0` });
    }
  }
  if (invuln_save !== null && !isWhole(invuln_save, 1)) {
    return res.status(400).json({ error: "invuln_save must be a whole number greater than 0, or null" });
  }

  if (!Array.isArray(wargear)) return res.status(400).json({ error: "wargear must be a list" });
  const cleanWargear = [];
  for (const [i, entry] of wargear.entries()) {
    const result = checkWargear(entry, i);
    if (typeof result === "string") return res.status(400).json({ error: result });
    cleanWargear.push(result);
  }

  if (!Array.isArray(abilities) || !abilities.every((a) => a && isText(a.Desc))) {
    return res.status(400).json({ error: 'abilities must be a list like [{ "Desc": "..." }]' });
  }

  req.unit = {
    name: name.trim(),
    movement,
    toughness,
    save,
    invuln_save,
    wounds,
    wargear: cleanWargear,
    abilities: abilities.map((a) => ({ Desc: a.Desc.trim() })),
  };
  next();
}
