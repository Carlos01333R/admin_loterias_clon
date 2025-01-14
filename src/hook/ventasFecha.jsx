import { supabase } from "./supabaseClient"; // Asegúrate de tener la configuración de Supabase
import { useState, useEffect } from "react";

const useVentasByFecha = (fechaInicio, fechaFin) => {
  const [ventas, setVentas] = useState([]);
  const [sector, setSector] = useState(null);
  const [totales, setTotales] = useState({
    valorBruta: 0,
    ventaNeta: 0,
    ganancias: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Recuperar el valor de 'userSector' de localStorage cuando se carga el componente
    const storedSector = localStorage.getItem("userSector");
    if (storedSector) {
      setSector(storedSector);
    }
  }, []);

  useEffect(() => {
    const fetchVentas = async () => {
      setLoading(true);
      setError(null); // Resetear error en cada nueva llamada
      try {
        // Llamamos a la función RPC creada en Supabase
        const { data, error } = await supabase.rpc(
          "obtener_ventas_y_totales_all",
          {
            fecha_inicio: fechaInicio,
            fecha_fin: fechaFin,
          }
        );
        if (error) throw error;

        // Asignamos los valores totales y las ventas
        setTotales({
          valorBruta: parseFloat(data[0].totales.total_valor_bruta) || 0,
          ventaNeta: parseFloat(data[0].totales.total_venta_neta) || 0,
          ganancias: parseFloat(data[0].totales.total_ganancias) || 0,
        });

        setVentas(data[0].ventas); // Establecer las ventas filtradas
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    // Solo ejecutar la consulta si las fechas están definidas
    if (fechaInicio && fechaFin && sector) {
      fetchVentas();
    }
  }, [fechaInicio, fechaFin, sector]);

  return { ventas, totales, loading, error };
};

export default useVentasByFecha;
