-- db/seed.sql: the sample_units from data/crusade.js, as rows.
-- Optional. Run AFTER schema.sql. Running it twice adds the units twice.
-- Supabase picks the ids, so they will not be 8000, 8001, 8002.

insert into public.units (user_id, name, movement, toughness, save, invuln_save, wounds, wargear, abilities)
values
  (
    null, 'Gundam RX-93 v Nu', 4, 16, 3, 4, 20,
    '[
      {"Name": "Fin Funnels", "Abilities": ["Ability 1", "Ability 2"], "Range": 12, "A": 6, "BS": 2, "S": 50, "AP": "-3", "D": "1d20"},
      {"Name": "Punch", "Abilities": null, "Range": "Melee", "A": 1, "BS": 5, "S": 10, "AP": 0, "D": 1}
    ]'::jsonb,
    '[{"Desc": "Ability 1"}, {"Desc": "Ability 2"}]'::jsonb
  ),
  (
    null, 'Average guy', 2, 1, 6, null, 1,
    '[{"Desc": "He''s just an average guy."}]'::jsonb,
    '[]'::jsonb
  );
