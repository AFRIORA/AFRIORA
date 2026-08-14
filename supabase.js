/* =========================================================
   AFRIORA — SUPABASE CLIENT
========================================================= */

const SUPABASE_URL =
    "https://icmoskjyhldsqcyxhxui.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_XkxCTZol2qYOWgicCuv8YQ_fjtym_vO";

const supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);

window.AFRIORA_SUPABASE = supabase;