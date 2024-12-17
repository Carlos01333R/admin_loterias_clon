import { useState } from "react";
import { supabase } from "./supabaseClient"; // Asegúrate de que la ruta sea correcta

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    setLoading(true);
    setError(null); // Reinicia el error antes de iniciar sesión

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError("Credenciales incorrectas. Verifique su email o contraseña.");
      } else if (data.user) {
        // Redirige a una página después del login exitoso
        window.location.href = "/admin/dashboard"; // Cambia '/dashboard' por tu ruta deseada
      }
    } catch (error) {
      setError("Ocurrió un error inesperado");
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};
