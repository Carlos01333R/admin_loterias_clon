import { createClient } from "@supabase/supabase-js";

// Reemplaza con tu URL y la clave pública de Supabase
const supabaseUrl = "https://qqhuewmhsydemhuynfzw.supabase.co";

const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxaHVld21oc3lkZW1odXluZnp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQwMjM3MzYsImV4cCI6MjA0OTU5OTczNn0.Wr89oAc2Co8TuRzlPypLk4FMad_-Zq01e7uQav6f1As";

export const supabase = createClient(supabaseUrl, supabaseKey);
