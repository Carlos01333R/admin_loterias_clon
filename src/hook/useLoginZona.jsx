import { useState } from "react";
import { supabase } from "./supabaseClient";

export const useLoginZona = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sector, setSector] = useState(null); // Estado para almacenar el sector

  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      // Consulta para verificar si el email existe y obtener el sector
      const { data, error } = await supabase
        .from("admin_zona")
        .select("email, password, sector") // Incluye el campo 'sector'
        .eq("email", email)
        .single();

      if (error || !data) {
        setError("Credenciales incorrectas. Verifique su email o contraseña.");
      } else {
        // Verificar si la contraseña es correcta (en texto plano o usando hashes)
        if (password === data.password) {
          // Almacenar el sector en localStorage y también en el estado local
          localStorage.setItem("userEmail", email);
          localStorage.setItem("userSector", data.sector); // Guarda el sector en localStorage
          setSector(data.sector); // Actualiza el estado del sector

          // Redirigir a la página de administración de zona
          window.location.href = "/adminZona/dashboard";
        } else {
          setError(
            "Credenciales incorrectas. Verifique su email o contraseña."
          );
        }
      }
    } catch (error) {
      setError("Ocurrió un error inesperado.");
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error, sector }; // Devuelve el sector como parte del hook
};
