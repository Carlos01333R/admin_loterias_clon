import { useState, useEffect, useCallback } from "react";
import { supabase } from "./supabaseClient";
import useZonas from "./useZona";

const useVentasHoyAdminZona = ({ sector, email }) => {
  const [valorBrutaHoy, setValorBrutaHoy] = useState(0);
  const [ventaNetaHoy, setVentaNetaHoy] = useState(0);
  const [gananciasHoy, setGananciasHoy] = useState(0);
  const [fechaActual, setFechaActual] = useState("");
  const { zonas } = useZonas();

  const adminZona = zonas
    ? zonas.find((z) => z.nombre === sector)?.porcentaje_admin_zona
    : null;

  const obtenerFechaActual = useCallback(() => {
    const hoy = new Date();
    return `${hoy.getDate()}/${hoy.getMonth() + 1}/${hoy.getFullYear()}`;
  }, []);

  const fetchVentasHoy = useCallback(async () => {
    const fechaHoy = obtenerFechaActual();

    let query = supabase
      .from("ventas")
      .select("valor_bruta, venta_neta, ganancias")
      .eq("fecha", fechaHoy);

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

    if (error) {
      console.error("Error al recuperar los datos:", error);
      return;
    }

    const totalValorBruto = data.reduce(
      (sum, venta) => sum + (Number(venta.valor_bruta) || 0),
      0
    );
    const totalVentaNeta = data.reduce(
      (sum, venta) => sum + (Number(venta.venta_neta) || 0),
      0
    );
    const totalGanancias = data.reduce(
      (sum, venta) => sum + (Number(venta.ganancias) || 0),
      0
    );

    setValorBrutaHoy(totalValorBruto);
    setVentaNetaHoy(totalVentaNeta);
    setGananciasHoy(totalGanancias);
    setFechaActual(fechaHoy);
  }, [sector, email, obtenerFechaActual]);

  useEffect(() => {
    fetchVentasHoy(); // Ejecutar cuando se monta el componente o cambian las dependencias

    // Configurar un intervalo para comprobar cambios de fecha cada minuto
    const intervalo = setInterval(() => {
      fetchVentasHoy();
    }, 60000); // 60000 ms = 1 minuto

    // Limpiar el intervalo al desmontar el componente
    return () => clearInterval(intervalo);
  }, [fetchVentasHoy, sector]);

  return { valorBrutaHoy, ventaNetaHoy, gananciasHoy, adminZona, fechaActual };
};

export default useVentasHoyAdminZona;
