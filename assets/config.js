// Supabase project config — reused from amanda-repository.
// The anon key is public by design: Supabase Auth + Row Level Security are the
// security boundary, not the key. See docs/calculator_events_schema.sql for
// the RLS policies that protect this table.
window.CALC_CONFIG = {
    SUPABASE_URL:      'https://ctohybdnobylnlhpbajt.supabase.co',
    SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0b2h5YmRub2J5bG5saHBiYWp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0NzQ3NzUsImV4cCI6MjA5NzA1MDc3NX0.ZhZgpzyuyESsznQekCf-BKWP9xUiCcPInr850occcLM',
    EVENT_TABLE:       'calculator_events',
};
