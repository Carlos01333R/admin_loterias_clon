import { supabase } from "./supabaseClient";
import { useState, useEffect } from "react";

// Función para convertir de "d/m/yyyy" a "yyyy-mm-dd"
const convertirFecha = (fecha) => {
  const [dia, mes, año] = fecha.split("/");
  return `${año}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;
};

const useFechaAdminZona = (fechaInicio, fechaFin) => {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sector, setSector] = useState(null);

  const [totales, setTotales] = useState({
    valorBruta: 0,
    ventaNeta: 0,
    ganancias: 0,
  });

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
      try {
        // Traer todas las ventas del usuario
        const { data, error } = await supabase
          .from("ventas")
          .select("*")
          .eq("zona", sector);

        if (error) throw error;

        // Convertir fechas de entrada (formato yyyy-mm-dd)
        const fechaInicioConvertida = convertirFecha(fechaInicio);
        const fechaFinConvertida = convertirFecha(fechaFin);

        console.log(fechaInicioConvertida, fechaFinConvertida);

        // Filtrar las ventas por rango de fechas
        const ventasFiltradas = data.filter((venta) => {
          const fechaVentaConvertida = convertirFecha(venta.fecha); // Convertir fecha de la venta al mismo formato
          return (
            fechaVentaConvertida >= fechaInicioConvertida &&
            fechaVentaConvertida <= fechaFinConvertida
          );
        });

        // Sumar los valores de valor_bruta, venta_neta y ganancias
        const totalesCalculados = ventasFiltradas.reduce(
          (acc, venta) => {
            acc.valorBruta += parseFloat(venta.valor_bruta) || 0;
            acc.ventaNeta += parseFloat(venta.venta_neta) || 0;
            acc.ganancias += parseFloat(venta.ganancias) || 0;
            return acc;
          },
          { valorBruta: 0, ventaNeta: 0, ganancias: 0 }
        );

        setVentas(ventasFiltradas);
        setTotales(totalesCalculados);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (fechaInicio && fechaFin) {
      fetchVentas();
    }
  }, [sector, fechaInicio, fechaFin]);

  return { ventas, loading, error, totales };
};

export default useFechaAdminZona;
