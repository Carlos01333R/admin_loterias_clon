import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

export default function useObtenerDetallesWin(fechaInicio, fechaFin, zona) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Evitamos ejecutar si los parámetros están vacíos
    if (!fechaInicio || !fechaFin || !zona) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase.rpc(
          "obtener_premios_por_rango",
          {
            fecha_inicio_param: fechaInicio,
            fecha_fin_param: fechaFin,
            zona_param: zona,
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
  }, [fechaInicio, fechaFin, zona]);

  return { data, loading, error };
}
