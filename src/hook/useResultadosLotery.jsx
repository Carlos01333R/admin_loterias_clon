import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

const useResultadosLoteriaHoy = () => {
  const [resultadosHoy, setResultadosHoy] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtener la fecha actual y la fecha de hace 48 horas en formato YYYY-MM-DD
  const getDateRange = () => {
    const now = new Date();
    const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);

    const formatDate = (date) => {
      return date.toISOString().split("T")[0];
    };

    return {
      startDate: formatDate(twoDaysAgo),
      endDate: formatDate(now),
    };
  };

  useEffect(() => {
    const fetchResultados48h = async () => {
      setLoading(true);
      setError(null);
      const { startDate, endDate } = getDateRange();

      try {
        const { data, error } = await supabase
          .from("resultados_loteria")
          .select("*")
          .gte("date", startDate)
          .lte("date", endDate)
          .order("date", { ascending: false });

        if (error) {
          throw error;
        }

        setResultadosHoy(data || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResultados48h();
  }, []);

  return { resultadosHoy, loading, error };
};

export default useResultadosLoteriaHoy;
