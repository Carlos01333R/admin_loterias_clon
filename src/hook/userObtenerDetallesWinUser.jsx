import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

export default function useObtenerDetallesWinUser(
  fechaInicio,
  fechaFin,
  email
) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Evitamos ejecutar si los parámetros están vacíos
    if (!fechaInicio || !fechaFin || !email) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase.rpc(
          "obtener_detalles_win_user",
          {
            fecha_inicio_param: fechaInicio,
            fecha_fin_param: fechaFin,
            email_param: email,
          }
        );

        if (error) throw error;

        setData(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fechaInicio, fechaFin, email]);

  return { data, loading, error };
}
