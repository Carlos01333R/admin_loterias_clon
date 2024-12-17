import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

const useVentasGeneralesHoy = () => {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVentas = async () => {
      try {
        setLoading(true);

        // Obtener la fecha actual en formato DD/MM/YYYY
        const hoy = new Date().toLocaleDateString("es-CO"); // Formato regional en español (Colombia)

        // Consulta a la tabla de ventas filtrando por la fecha actual
        const { data, error } = await supabase
          .from("ventas")
          .select("*")
          .eq("fecha", hoy); // Compara la fecha con el formato DD/MM/YYYY

        if (error) {
          throw error;
        }

        setVentas(data || []);
      } catch (err) {
        console.error("Error al obtener las ventas:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVentas();
  }, []);

  return { ventas, loading, error };
};

export default useVentasGeneralesHoy;
