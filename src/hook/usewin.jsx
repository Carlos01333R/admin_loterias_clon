import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

// Función para obtener la combinación de un número de boleto
const getCombinaciones = (numero) => {
  const permutations = (str) => {
    if (str.length === 1) return [str];
    const result = [];
    for (let i = 0; i < str.length; i++) {
      const char = str[i];
      const remainingChars = str.slice(0, i) + str.slice(i + 1);
      for (const perm of permutations(remainingChars)) {
        result.push(char + perm);
      }
    }
    return result;
  };
  return permutations(numero);
};

const useLoteriaComparison = () => {
  const [ventas, setVentas] = useState([]);
  const [apiResults, setApiResults] = useState([]);
  const [matches, setMatches] = useState([]);

  // Función para obtener la fecha de hace 48 horas en formato D/M/YYYY
  const getDate48HoursAgo = () => {
    const today = new Date();
    today.setHours(today.getHours() - 48); // Restamos 48 horas
    const day = today.getDate(); // Día sin ceros a la izquierda
    const month = today.getMonth() + 1; // Enero es 0, así que sumamos 1
    const year = today.getFullYear();
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
      2,
      "0"
    )}T${String(today.getHours()).padStart(2, "0")}:${String(
      today.getMinutes()
    ).padStart(2, "0")}:${String(today.getSeconds()).padStart(2, "0")}`; // Formato YYYY-MM-DDTHH:mm:ss
  };

  useEffect(() => {
    const fetchVentasUltimas48Horas = async () => {
      try {
        const date48HoursAgo = getDate48HoursAgo(); // Obtener fecha de hace 48 horas

        const { data, error } = await supabase
          .from("ventas")
          .select(
            "loterias, boletos, nombre, celular, fecha, hora, fecha_hora, numero_venta, zona, vendedor, valor_bruta"
          )
          .gte("fecha_hora", date48HoursAgo); // Filtrar por fecha_hora mayor o igual a las últimas 48 horas

        if (error) {
          console.error("Error al obtener ventas:", error);
        } else {
          console.log("Ventas en las últimas 48 horas:", data);
          setVentas(data); // Guardar ventas obtenidas
        }
      } catch (error) {
        console.error(
          "Error al obtener ventas en las últimas 48 horas:",
          error
        );
      }
    };

    const fetchLastTwoDaysResults = async () => {
      try {
        const today = new Date();
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(today.getDate() - 2);

        // Convertimos las fechas a formato YYYY-MM-DD
        const formattedToday = today.toISOString().split("T")[0];
        const formattedTwoDaysAgo = twoDaysAgo.toISOString().split("T")[0];

        // Hacemos la consulta al supabase
        const { data, error } = await supabase
          .from("resultados_loteria")
          .select("lottery, result, date")
          .gte("date", formattedTwoDaysAgo) // Fecha >= hace dos días
          .lte("date", formattedToday); // Fecha <= hoy

        if (error) {
          console.error(
            "Error al obtener resultados de los últimos dos días:",
            error
          );
        } else {
          console.log("Resultados de los últimos dos días:", data);
          setApiResults(data); // Guardamos los resultados en el estado (si se usa)
        }
      } catch (error) {
        console.error("Error inesperado al recuperar datos:", error);
      }
    };

    fetchVentasUltimas48Horas(); // Obtener ventas de las últimas 48 horas
    fetchLastTwoDaysResults(); // Obtener resultados de la lotería de las últimos 2 días
  }, []);

  useEffect(() => {
    const matchedResults = [];

    if (ventas.length > 0 && apiResults.length > 0) {
      ventas.forEach((venta) => {
        let loteriasVenta = Array.isArray(venta.loterias)
          ? venta.loterias.map((loteria) => loteria.trim().toUpperCase())
          : JSON.parse(venta.loterias || "[]");

        let boletosVenta =
          typeof venta.boletos === "string"
            ? JSON.parse(venta.boletos || "[]")
            : venta.boletos;

        boletosVenta.forEach((boleto) => {
          const numeroBoleto = boleto.numero;
          const premio = boleto.premio || 0;
          const combi = boleto.conbi || 0;

          apiResults.forEach((apiResult) => {
            const result = apiResult.result || "";
            const lotteryName = apiResult.lottery.toUpperCase();
            const apiDate = apiResult.date;

            const [day, month, year] = venta.fecha.split("/");
            const ventaFormattedDate = `${year}-${String(month).padStart(
              2,
              "0"
            )}-${String(day).padStart(2, "0")}`;

            if (
              loteriasVenta.includes(lotteryName) &&
              ventaFormattedDate === apiDate
            ) {
              let match2 = false;
              let match3 = false;
              let match4 = false;

              // Si el número de boleto tiene 4 cifras y la combinada es mayor a 0
              if (numeroBoleto.length === 4 && boleto.conbi > 0) {
                const combinaciones = getCombinaciones(numeroBoleto);
                combinaciones.forEach((combinacion) => {
                  if (combinacion === result) {
                    match4 = true; // Número completo de cualquier combinación
                  }
                });
              } else if (numeroBoleto.length === 4 && result === numeroBoleto) {
                match4 = true; // Número completo
              } else if (numeroBoleto.length === 3 && boleto.conbi > 0) {
                const combinaciones = getCombinaciones(numeroBoleto);
                // Aquí comparamos las combinaciones con los últimos 3 dígitos del resultado
                combinaciones.forEach((combinacion) => {
                  if (result.endsWith(combinacion)) {
                    match3 = true; // Coincide con los últimos 3 dígitos
                  }
                });
              } else if (
                numeroBoleto.length === 3 &&
                result.endsWith(numeroBoleto)
              ) {
                match3 = true; // Últimos 3 dígitos
              } else if (
                numeroBoleto.length === 2 &&
                result.endsWith(numeroBoleto)
              ) {
                match2 = true; // Últimos 2 dígitos
              }

              matchedResults.push({
                lottery: lotteryName,
                boleto: numeroBoleto,
                result,
                match2,
                match3,
                match4,
                premio,
                combi,
                nombre: venta.nombre,
                celular: venta.celular,
                fecha: venta.fecha,
                hora: venta.hora,
                fecha_hora: venta.fecha_hora,
                numero_venta: venta.numero_venta,
                zona: venta.zona,
                email: venta.vendedor,
                venta: venta.valor_bruta,
              });
            }
          });
        });
      });
      setMatches(matchedResults);
    }
  }, [ventas, apiResults]);

  return { matches };
};

export default useLoteriaComparison;
