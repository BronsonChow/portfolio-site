// routes/units.js: the navigator. Owns req and res, picks status codes,
// and asks the service for data. It never talks to Supabase directly.

import { Router } from "express";
import { checkId, validateUnit } from "../middleware/validate.js";
import { requireAuth } from "../middleware/require-auth.js";
import { listUnits, getUnit, createUnit, deleteUnit } from "../services/units.js";

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

// DELETE /api/units/3   (login required, and it has to be yours)
router.delete("/:id", requireAuth, checkId, async (req, res) => {
  const deleted = await deleteUnit(req.unitId, req.user.id);
  if (!deleted) return res.status(404).json({ error: "Unit not found" });
  res.status(204).end();
});

export default router;
