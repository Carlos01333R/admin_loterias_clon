import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

export default function usePremioUserByFechaTable(desde, hasta, emails) {
  const [premiosPorEmail, setPremiosPorEmail] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      const premiosTemp = {};

      for (const email of emails) {
        try {
          const { data, error } = await supabase.rpc(
            "obtener_total_premio_user",
            {
              fecha_inicio_param: desde,
              fecha_fin_param: hasta,
              email_param: email,
            }
          );

          if (error) throw error;

          premiosTemp[email] = data; // Guarda el resultado en el objeto temporal
        } catch (err) {
          setError(
            `Error al recuperar los premios para ${email}: ${err.message}`
          );
          return; // Detiene la ejecución en caso de error
        }
      }

      setPremiosPorEmail(premiosTemp); // Actualiza el estado con los resultados
      setLoading(false);
    };

    if (desde && hasta && emails.length > 0) fetchData();
  }, [desde, hasta, emails]);

  return { premiosPorEmail, loading, error };
}
