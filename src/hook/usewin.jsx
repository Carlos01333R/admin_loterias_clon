import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

// Función para generar todas las combinaciones posibles de un número
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

const getCurrentFormattedDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0]; // Formato: YYYY-MM-DD
};

const useLoteriaComparison = () => {
  const [ventas, setVentas] = useState([]);
  const [apiResults, setApiResults] = useState([]);
  const [matches, setMatches] = useState([]);

  const getDateRange = () => {
    const now = new Date();
    const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);

    const formatDate = (date) => {
      return date.toISOString().split("T")[0];
    };

    return {
      startDate: formatDate(twoDaysAgo),
      endDate: formatDate(now),
    };
  };

  useEffect(() => {
    const fetchVentas = async () => {
      const { data, error } = await supabase
        .from("ventas")
        .select(
          "loterias, boletos, nombre, celular, fecha, hora, fecha_hora, numero_venta, zona, vendedor"
        );

      if (error) {
        console.error("Error fetching ventas:", error);
      } else {
        setVentas(data);
        console.log("ventas:", data);
      }
    };

    const fetchApiResults = async () => {
      try {
        const { startDate, endDate } = getDateRange();
        const { data, error } = await supabase
          .from("resultados_loteria")
          .select("lottery, result, date")
          .gte("date", startDate)
          .lte("date", endDate)
          .order("date", { ascending: false });

        if (error) {
          console.error(
            "Error fetching resultados_loteria from Supabase:",
            error
          );
        } else {
          setApiResults(data);
          console.log("Resultados de la API:", data);
        }
      } catch (error) {
        console.error("Error fetching data from Supabase:", error);
      }
    };

    fetchVentas();
    fetchApiResults();
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
            )}-${day.length > 1 ? day : `0${day}`}`;

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
