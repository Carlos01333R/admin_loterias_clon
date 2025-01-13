import { supabase } from "./supabaseClient"; // Asegúrate de tener la configuración de Supabase
import { useState, useEffect } from "react";

const useVentasTotales = (fechaInicio, fechaFin) => {
  const [ventas, setVentas] = useState([]);
  const [sector, setSector] = useState(null);
  const [totales, setTotales] = useState({
    valorBruta: 0,
    ventaNeta: 0,
    ganancias: 0,
  });
  const [totalesPorVendedor, setTotalesPorVendedor] = useState({}); // Estado para almacenar los totales por vendedor
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
        const { data, error } = await supabase.rpc("obtener_ventas_y_totales", {
          zona_param: sector,
          fecha_inicio: fechaInicio,
          fecha_fin: fechaFin,
        });
        if (error) throw error;

        // Asignamos los valores totales y las ventas
        setTotales({
          valorBruta: parseFloat(data[0].totales.total_valor_bruta) || 0,
          ventaNeta: parseFloat(data[0].totales.total_venta_neta) || 0,
          ganancias: parseFloat(data[0].totales.total_ganancias) || 0,
        });

        const ventasFiltradas = data[0].ventas;

        // Agrupar y sumar los valores por vendedor
        const totalesPorVendedorCalculados = ventasFiltradas.reduce(
          (acc, venta) => {
            const vendedor = venta.vendedor;

            // Si el vendedor no está en el acumulador, inicializarlo
            if (!acc[vendedor]) {
              acc[vendedor] = { valorBruta: 0, ventaNeta: 0, ganancias: 0 };
            }

            // Sumar los valores correspondientes a cada vendedor
            acc[vendedor].valorBruta += parseFloat(venta.valor_bruta) || 0;
            acc[vendedor].ventaNeta += parseFloat(venta.venta_neta) || 0;
            acc[vendedor].ganancias += parseFloat(venta.ganancias) || 0;

            return acc;
          },
          {}
        );

        setTotalesPorVendedor(totalesPorVendedorCalculados); // Actualizar el estado con los totales por vendedor

        setVentas(ventasFiltradas); // Establecer las ventas filtradas
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    // Solo ejecutar la consulta si las fechas están definidas y el sector está establecido
    if (fechaInicio && fechaFin && sector) {
      fetchVentas();
    }
  }, [fechaInicio, fechaFin, sector]);

  return { ventas, totales, totalesPorVendedor, loading, error };
};

export default useVentasTotales;
