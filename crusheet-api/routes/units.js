// routes/units.js: the navigator. Owns req and res, picks status codes,
// and asks the service for data. It never talks to Supabase directly.

import { Router } from "express";
import {
  checkId,
  checkIndex,
  checkEntryChanges,
  validateUnit,
  validateUnitPatch,
  mergeWargearEntry,
  mergeAbilityEntry,
} from "../middleware/validate.js";
import { requireAuth } from "../middleware/require-auth.js";
import { listUnits, getUnit, createUnit, updateUnit, deleteUnit } from "../services/units.js";

const router = Router();

// GET /api/units   (anyone can read)
router.get("/", async (req, res) => {
  res.json(await listUnits());
});

// GET /api/units/3   (anyone can read)
router.get("/:id", checkId, async (req, res) => {
  const unit = await getUnit(req.unitId);
  if (!unit) return res.status(404).json({ error: `No unit with id ${req.unitId}` });
  res.json(unit);
});

// POST /api/units   (login required)
// The owner comes from the TOKEN (req.user), never from the body.
router.post("/", requireAuth, validateUnit, async (req, res) => {
  res.status(201).json(await createUnit({ ...req.unit, user_id: req.user.id }));
});

// PATCH /api/units/3   (login required, and it has to be yours)
// Send only the fields to change, e.g. { "wounds": 12 }.
router.patch("/:id", requireAuth, checkId, validateUnitPatch, async (req, res) => {
  const unit = await updateUnit(req.unitId, req.user.id, req.changes);
  if (!unit) return res.status(404).json({ error: "Unit not found" });
  res.json(unit);
});

// PATCH /api/units/3/wargear/0     { "Range": 13 }
// PATCH /api/units/3/abilities/1   { "Desc": "Deep Strike" }
// (login required, and it has to be yours)
// Changes ONE entry, keeping the rest of it and the rest of the list as they are.
// Supabase can't edit inside a jsonb list, so we read the list, swap the entry, and save the list.
function patchListEntry(listName, merge) {
  return async (req, res) => {
    const unit = await getUnit(req.unitId);
    if (!unit) return res.status(404).json({ error: "Unit not found" });

    const list = unit[listName] ?? [];
    if (req.index >= list.length) {
      return res.status(404).json({ error: `Unit ${req.unitId} has no ${listName} entry ${req.index}` });
    }

    const result = merge(list[req.index], req.changes, req.index);
    if (result.error) return res.status(400).json({ error: result.error });

    const newList = list.map((entry, i) => (i === req.index ? result.value : entry));
    const saved = await updateUnit(req.unitId, req.user.id, { [listName]: newList });
    if (!saved) return res.status(404).json({ error: "Unit not found" }); // not yours
    res.json(saved);
  };
}

const entryChecks = [requireAuth, checkId, checkIndex, checkEntryChanges];
router.patch("/:id/wargear/:index", ...entryChecks, patchListEntry("wargear", mergeWargearEntry));
router.patch("/:id/abilities/:index", ...entryChecks, patchListEntry("abilities", mergeAbilityEntry));

// DELETE /api/units/3   (login required, and it has to be yours)
router.delete("/:id", requireAuth, checkId, async (req, res) => {
  const deleted = await deleteUnit(req.unitId, req.user.id);
  if (!deleted) return res.status(404).json({ error: "Unit not found" });
  res.status(204).end();
});

export default router;
