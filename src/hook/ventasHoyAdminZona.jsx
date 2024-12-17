import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import useZonas from "./useZona";

const useVentasHoyAdminZona = ({ sector, email }) => {
  const [valorBrutaHoy, setValorBrutaHoy] = useState(0);
  const [ventaNetaHoy, setVentaNetaHoy] = useState(0);
  const [gananciasHoy, setGananciasHoy] = useState(0);
  const { zonas } = useZonas();

  const adminZona = zonas
    ? zonas.find((z) => z.nombre === sector)?.porcentaje_admin_zona
    : null;

  // Función para convertir la fecha de texto a objeto Date
  const parseFecha = (fechaTexto) => {
    const [dia, mes, año] = fechaTexto.split("/").map(Number);
    return new Date(año, mes - 1, dia); // Mes es 0-indexed en JavaScript
  };

  // Función para recuperar las ventas del día actual, dependiendo del parámetro pasado
  const fetchVentasHoy = async () => {
    const today = new Date();
    const fechaActual = today.setHours(0, 0, 0, 0);

    // Realiza la consulta según el parámetro que se pase
    let query = supabase
      .from("ventas")
      .select("valor_bruta, venta_neta, ganancias, fecha");

    if (sector) {
      query = query.eq("zona", sector);
    } else if (email) {
      query = query.eq("vendedor", email);
    } else {
      console.error(
        "No se proporcionó sector ni email para realizar la consulta."
      );
      return;
    }

    const { data, error } = await query;
    console.log(data)

    if (error) {
      console.error("Error al recuperar los datos: ", error);
      return;
    }

    const totalValorBruto = data.reduce((acc, row) => {
      const fechaVenta = parseFecha(row.fecha);
      return fechaVenta.getTime() === fechaActual
        ? acc + (Number(row.valor_bruta) || 0)
        : acc;
    }, 0);

    const totalVentaNeta = data.reduce((acc, row) => {
      const fechaVenta = parseFecha(row.fecha);
      return fechaVenta.getTime() === fechaActual
        ? acc + (Number(row.venta_neta) || 0)
        : acc;
    }, 0);

    const totalGanancias = data.reduce((acc, row) => {
      const fechaVenta = parseFecha(row.fecha);
      return fechaVenta.getTime() === fechaActual
        ? acc + (Number(row.ganancias) || 0)
        : acc;
    }, 0);

    setValorBrutaHoy(totalValorBruto);
    setVentaNetaHoy(totalVentaNeta);
    setGananciasHoy(totalGanancias);
  };

  useEffect(() => {
    fetchVentasHoy();
  }, [sector, email]);

  return { valorBrutaHoy, ventaNetaHoy, gananciasHoy, adminZona };
};

export default useVentasHoyAdminZona;
