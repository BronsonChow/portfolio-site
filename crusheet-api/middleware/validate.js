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

// One checker per Unit field. Each returns { value } (cleaned) or { error }.
// POST checks every field; PATCH checks only the fields that were sent.
const fieldChecks = {
  name(value) {
    if (!isText(value)) return { error: "name is required" };
    return { value: value.trim() };
  },
  movement(value) {
    if (!isWhole(value, 0)) return { error: "movement must be a whole number, 0 or more" };
    return { value };
  },
  toughness: (value) => wholeAboveZero("toughness", value),
  save: (value) => wholeAboveZero("save", value),
  wounds: (value) => wholeAboveZero("wounds", value),
  invuln_save(value) {
    if (value !== null && !isWhole(value, 1)) {
      return { error: "invuln_save must be a whole number greater than 0, or null" };
    }
    return { value };
  },
  wargear(value) {
    if (!Array.isArray(value)) return { error: "wargear must be a list" };
    const clean = [];
    for (const [i, entry] of value.entries()) {
      const result = checkWargear(entry, i);
      if (typeof result === "string") return { error: result };
      clean.push(result);
    }
    return { value: clean };
  },
  abilities(value) {
    if (!Array.isArray(value) || !value.every((a) => a && isText(a.Desc))) {
      return { error: 'abilities must be a list like [{ "Desc": "..." }]' };
    }
    return { value: value.map((a) => ({ Desc: a.Desc.trim() })) };
  },
};

function wholeAboveZero(key, value) {
  if (!isWhole(value, 1)) return { error: `${key} must be a whole number greater than 0` };
  return { value };
}

// Runs the checker for each field given. Stops at the first problem.
function checkFields(fields) {
  const clean = {};
  for (const [key, value] of Object.entries(fields)) {
    const result = fieldChecks[key](value);
    if (result.error) return result;
    clean[key] = result.value;
  }
  return { value: clean };
}

// POST: a new unit needs a name and its stat line. wargear and abilities are optional.
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

  const result = checkFields({ name, movement, toughness, save, invuln_save, wounds, wargear, abilities });
  if (result.error) return res.status(400).json({ error: result.error });

  req.unit = result.value;
  next();
}

// PATCH: send only the fields you want to change, e.g. { "wounds": 12 }.
// id, user_id and anything else unknown is refused, so nobody can steal a unit.
export function validateUnitPatch(req, res, next) {
  const body = req.body ?? {};
  if (typeof body !== "object" || Array.isArray(body)) {
    return res.status(400).json({ error: "The request body must be a JSON object" });
  }

  const keys = Object.keys(body);
  if (keys.length === 0) {
    return res.status(400).json({ error: "Send at least one field to change" });
  }
  const unknown = keys.filter((key) => !Object.hasOwn(fieldChecks, key));
  if (unknown.length > 0) {
    return res.status(400).json({ error: `These fields cannot be changed: ${unknown.join(", ")}` });
  }

  const result = checkFields(body);
  if (result.error) return res.status(400).json({ error: result.error });

  req.changes = result.value;
  next();
}

// ---------------------------------------------------------------------------
// PATCH /api/units/:id/wargear/:index and /abilities/:index
// Change one entry in a list, sending only the fields that change.

// /wargear/0 is fine. /wargear/-1 and /wargear/first are not.
export function checkIndex(req, res, next) {
  const index = Number(req.params.index);
  if (!Number.isInteger(index) || index < 0) {
    return res.status(404).json({ error: `No entry "${req.params.index}". Entries are numbered from 0.` });
  }
  req.index = index;
  next();
}

// The body has to be a non-empty object, e.g. { "Range": 13 }.
// What each field is allowed to be is checked once it is merged with the entry.
export function checkEntryChanges(req, res, next) {
  const body = req.body ?? {};
  if (typeof body !== "object" || Array.isArray(body)) {
    return res.status(400).json({ error: "The request body must be a JSON object" });
  }
  if (Object.keys(body).length === 0) {
    return res.status(400).json({ error: "Send at least one field to change" });
  }
  req.changes = body;
  next();
}

const WEAPON_KEYS = ["Name", "Abilities", "Range", "A", "BS", "S", "AP", "D"];

function refuseUnknown(changes, allowed) {
  const unknown = Object.keys(changes).filter((key) => !allowed.includes(key));
  return unknown.length > 0 ? unknown : null;
}

// Merges changes into one wargear entry and checks the result.
// A weapon keeps being a weapon and a note keeps being a note.
// Returns { value } (the cleaned entry) or { error }.
export function mergeWargearEntry(entry, changes, i) {
  const isWeapon = "Name" in entry;
  const unknown = refuseUnknown(changes, isWeapon ? WEAPON_KEYS : ["Desc"]);
  if (unknown) {
    return {
      error: isWeapon
        ? `wargear[${i}] is a weapon. These fields cannot be changed: ${unknown.join(", ")}`
        : `wargear[${i}] is a note, so only Desc can be changed. To turn it into a weapon, PATCH the whole wargear list.`,
    };
  }
  const result = checkWargear({ ...entry, ...changes }, i);
  return typeof result === "string" ? { error: result } : { value: result };
}

// Abilities are notes, so Desc is the only field.
export function mergeAbilityEntry(entry, changes, i) {
  const unknown = refuseUnknown(changes, ["Desc"]);
  if (unknown) return { error: `abilities[${i}] only has Desc. These fields cannot be changed: ${unknown.join(", ")}` };
  if (!isText(changes.Desc)) return { error: `abilities[${i}].Desc must be text` };
  return { value: { Desc: changes.Desc.trim() } };
}
