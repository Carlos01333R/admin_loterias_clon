// auth.js (middleware de autenticación)
import { supabase } from "./supabaseClient";

export async function authenticate() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session) {
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/", // Redirigir a la página de inicio
      },
    });
  }

  return session; // Retornar la sesión si es válida
}
