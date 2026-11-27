// services/units-supabase.js: the cook, using your real Supabase table (db/schema.sql).
// No req, no res, no status codes. Just "get me the data" and "save this".

import { supabase } from "../data/supabase.js";

// The Unit fields from data/crusade.js. user_id and created_at stay in the database.
const COLUMNS = "id, name, movement, toughness, save, invuln_save, wounds, wargear, abilities";

export async function listUnits() {
  const { data, error } = await supabase.from("units").select(COLUMNS).order("id");
  if (error) throw error;
  return data;
}

export async function getUnit(id) {
  const { data, error } = await supabase.from("units").select(COLUMNS).eq("id", id).maybeSingle();
  if (error) throw error;
  return data; // null when there is no unit with that id
}

export async function createUnit(unit) {
  const { data, error } = await supabase.from("units").insert(unit).select(COLUMNS).single();
  if (error) throw error;
  return data;
}

export async function updateUnit(id, userId, changes) {
  const { data, error } = await supabase
    .from("units")
    .update(changes)
    .eq("id", id)
    .eq("user_id", userId) // only if it is yours
    .select(COLUMNS)
    .maybeSingle();
  if (error) throw error;
  return data; // null when there is no unit with that id that you own
}

export async function deleteUnit(id, userId) {
  const { data, error } = await supabase
    .from("units")
    .delete()
    .eq("id", id)
    .eq("user_id", userId) // only if it is yours
    .select("id");
  if (error) throw error;
  return data.length > 0; // true if something was deleted
}
