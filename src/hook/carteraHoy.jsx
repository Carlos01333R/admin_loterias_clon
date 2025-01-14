import { useState, useEffect, useCallback } from "react";
import { supabase } from "./supabaseClient";

const useCarteraHoy = () => {
  const [valorBrutaHoy, setValorBrutaHoy] = useState(0);
  const [ventaNetaHoy, setVentaNetaHoy] = useState(0);
  const [gananciasHoy, setGananciasHoy] = useState(0);
  const [fechaActual, setFechaActual] = useState("");

  const obtenerFechaActual = useCallback(() => {
    const hoy = new Date();
    return `${hoy.getDate()}/${hoy.getMonth() + 1}/${hoy.getFullYear()}`;
  }, []);

  const fetchVentasHoy = useCallback(async () => {
    const fechaHoy = obtenerFechaActual();

    if (fechaHoy === fechaActual) {
      return; // No actualizar si la fecha no ha cambiado
    }

    let query = supabase
      .from("ventas")
      .select("valor_bruta, venta_neta, ganancias")
      .eq("fecha", fechaHoy);

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
  }, [fechaActual]);

  useEffect(() => {
    fetchVentasHoy(); // Ejecutar inmediatamente al montar el componente

    // Configurar un intervalo para comprobar cambios de fecha cada minuto
    const intervalo = setInterval(() => {
      const nuevaFecha = obtenerFechaActual();
      if (nuevaFecha !== fechaActual) {
        fetchVentasHoy();
      }
    }, 60000); // 60000 ms = 1 minuto

    // Limpiar el intervalo al desmontar el componente
    return () => clearInterval(intervalo);
  }, [fetchVentasHoy, obtenerFechaActual, fechaActual]);

  return { valorBrutaHoy, ventaNetaHoy, gananciasHoy, fechaActual };
};

export default useCarteraHoy;
