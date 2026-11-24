// middleware/require-auth.js: the bouncer.
// No valid token, no entry. Valid token: we learn WHO is asking.

import { supabase } from "../data/supabase.js";

export async function requireAuth(req, res, next) {
  const header = req.headers.authorization ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "Log in first" });
  }

  // Sample-data mode has no Supabase, so nobody can log in.
  if (!supabase) {
    return res.status(500).json({
      error: "Login needs Supabase. Add your keys to crusheet-api/.env and restart.",
    });
  }

  // Ask Supabase: is this token real, and whose is it?
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  req.user = data.user; // routes can now use req.user.id
  next();
}
