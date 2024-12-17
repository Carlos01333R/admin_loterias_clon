import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient"; // Asegúrate de que este import es correcto

const useCarteraHoy = () => {
  const [valorBrutaHoy, setValorBrutaHoy] = useState(0);
  const [ventaNetaHoy, setVentaNetaHoy] = useState(0);
  const [gananciasHoy, setGananciasHoy] = useState(0);

  // Función para convertir la fecha de texto a objeto Date
  const parseFecha = (fechaTexto) => {
    const [dia, mes, año] = fechaTexto.split("/").map(Number);
    return new Date(año, mes - 1, dia); // Mes es 0-indexed en JavaScript
  };

  // Función para recuperar las ventas del día actual
  const fetchSector = async () => {
    const today = new Date();
    const fechaActual = today.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from("ventas")
      .select("valor_bruta, venta_neta, ganancias, fecha"); // Asegúrate de que la columna 'fecha' existe

    if (error) {
      console.error("Error fetching sector: ", error);
    } else if (data) {
      const totalValorBruto = data.reduce((acc, row) => {
        const fechaVenta = parseFecha(row.fecha);
        if (fechaVenta.getTime() === fechaActual) {
          // Comparar solo si es el día actual
          return acc + (Number(row.valor_bruta) || 0);
        }
        return acc;
      }, 0);

      const totalVentaNeta = data.reduce((acc, row) => {
        const fechaVenta = parseFecha(row.fecha);
        if (fechaVenta.getTime() === fechaActual) {
          return acc + (Number(row.venta_neta) || 0);
        }
        return acc;
      }, 0);

      const totalGanancias = data.reduce((acc, row) => {
        const fechaVenta = parseFecha(row.fecha);
        if (fechaVenta.getTime() === fechaActual) {
          return acc + (Number(row.ganancias) || 0);
        }
        return acc;
      }, 0);

      setValorBrutaHoy(totalValorBruto);
      setVentaNetaHoy(totalVentaNeta);
      setGananciasHoy(totalGanancias);
    } else {
      console.error("No sector found for this email");
    }
  };

  useEffect(() => {
    fetchSector();
  }, []);

  return { valorBrutaHoy, ventaNetaHoy, gananciasHoy };
};

export default useCarteraHoy;
