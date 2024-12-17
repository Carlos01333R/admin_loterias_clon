import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

const useResultadosLoteriaHoy = () => {
  const [resultadosHoy, setResultadosHoy] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtener la fecha actual en formato yyyy-mm-dd
  const getCurrentFormattedDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const fetchResultadosHoy = async () => {
      setLoading(true); // Inicia el estado de carga
      setError(null); // Reinicia el estado de error
      const today = getCurrentFormattedDate();

      try {
        const { data, error } = await supabase
          .from("resultados_loteria")
          .select("*")
          .eq("date", today); // Filtra los resultados por la fecha de hoy

        if (error) {
          throw error; // Lanza el error para manejarlo
        }

        setResultadosHoy(data || []); // Guarda los resultados o un array vacío
      } catch (error) {
        setError(error.message); // Almacena el mensaje de error
      } finally {
        setLoading(false); // Finaliza el estado de carga
      }
    };

    fetchResultadosHoy();
  }, []);

  return { resultadosHoy, loading, error };
};

export default useResultadosLoteriaHoy;
