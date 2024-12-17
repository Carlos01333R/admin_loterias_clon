import { supabase } from "./supabaseClient";
import { useState, useEffect } from "react";

// Función para convertir de "d/m/yyyy" a "yyyy-mm-dd"
const convertirFecha = (fecha) => {
  const [dia, mes, año] = fecha.split("/");
  return `${año}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;
};

const useTotalesPorVendedorZona = (fechaInicio, fechaFin, sector) => {
  const [totalesPorVendedor, setTotalesPorVendedor] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTotalesPorVendedor = async () => {
      setLoading(true);
      try {
        // Traer todas las ventas
        const { data, error } = await supabase
          .from("ventas")
          .select("*")
          .eq("zona", sector);

        if (error) throw error;

        // Convertir fechas de entrada (formato yyyy-mm-dd)
        const fechaInicioConvertida = convertirFecha(fechaInicio);
        const fechaFinConvertida = convertirFecha(fechaFin);

        // Filtrar las ventas por rango de fechas
        const ventasFiltradas = data.filter((venta) => {
          const fechaVentaConvertida = convertirFecha(venta.fecha);
          return (
            fechaVentaConvertida >= fechaInicioConvertida &&
            fechaVentaConvertida <= fechaFinConvertida
          );
        });

        // Agrupar y sumar los valores de valor_bruta, venta_neta y ganancias por vendedor
        const totalesCalculadosPorVendedor = ventasFiltradas.reduce(
          (acc, venta) => {
            const vendedor = venta.vendedor;

            if (!acc[vendedor]) {
              acc[vendedor] = { valorBruta: 0, ventaNeta: 0, ganancias: 0 };
            }

            acc[vendedor].valorBruta += parseFloat(venta.valor_bruta) || 0;
            acc[vendedor].ventaNeta += parseFloat(venta.venta_neta) || 0;
            acc[vendedor].ganancias += parseFloat(venta.ganancias) || 0;

            return acc;
          },
          {}
        );

        setTotalesPorVendedor(totalesCalculadosPorVendedor);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (fechaInicio && fechaFin) {
      fetchTotalesPorVendedor();
    }
  }, [fechaInicio, fechaFin, sector]);

  return { totalesPorVendedor, loading, error };
};

export default useTotalesPorVendedorZona;
