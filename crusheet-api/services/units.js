// services/units.js: picks which cook the routes talk to.
//
// Supabase keys set?  -> units-supabase.js (your real table, see db/schema.sql)
// No keys?            -> units-sample.js   (sample_units from data/crusade.js)
//
// The routes import from THIS file, so they never change either way.

import { config } from "../config/env.js";
import * as fromSupabase from "./units-supabase.js";
import * as fromSample from "./units-sample.js";

const source = config.useSupabase ? fromSupabase : fromSample;

export const { listUnits, getUnit, createUnit, updateUnit, deleteUnit } = source;
