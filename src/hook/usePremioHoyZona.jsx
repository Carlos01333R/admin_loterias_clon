import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

export default function useTotalPremioPorZona(zona) {
  const [totalPremio, setTotalPremio] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTotalPremio = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase.rpc(
          "calcular_total_premios_dos",
          {
            zona_param: zona,
          }
        );

        if (error) throw error;

        setTotalPremio(data); // Almacena el resultado en el estado
      } catch (err) {
        setError(`Error al obtener el total de premios: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    // Ejecuta la función si se proporciona una zona
    if (zona) fetchTotalPremio();
  }, [zona]);

  return { totalPremio, loading, error };
}
