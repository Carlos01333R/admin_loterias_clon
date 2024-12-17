import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

const useVentasPorZona = (zona) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVentas = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase.rpc(
          "obtener_totales_y_porcentajes_por_zona",
          { zona_param: zona }
        );

        if (error) throw error;

        setData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (zona) {
      fetchVentas();
    }
  }, [zona]);

  return { data, loading, error };
};

export default useVentasPorZona;
