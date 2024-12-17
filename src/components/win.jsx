import { useEffect, useState } from "react";
import { supabase } from "../hook/supabaseClient";
import useLoteriaComparison from "../hook/usewin";
import ResultadosComponent from "./ResultadosLotery/Proyectos/Resultados";

export default function WinLoterias() {
  const { matches } = useLoteriaComparison();
  const [savedMatches, setSavedMatches] = useState(new Set());

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (!data.session) {
        window.location.href = "/";
      }
    };
    checkSession();
  }, []);

  const filteredMatches = matches.filter(
    (match) => match.match2 || match.match3 || match.match4
  );

  const FormarPesoCop = (value) => {
    return value.toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  // Función para agrupar los premios por numero_venta
  const groupMatchesByNumeroVenta = (matches) => {
    return matches.reduce((acc, match) => {
      const { numero_venta, premio, boleto, match2, match3, match4 } = match;
      if (!acc[numero_venta]) {
        acc[numero_venta] = {
          ...match,
          premio: 0,
          boletos: [], // Inicializa el array de boletos
          match2: false,
          match3: false,
          match4: false,
        };
      }
      acc[numero_venta].premio += premio; // Suma el premio
      acc[numero_venta].boletos.push(boleto); // Agrega el boleto al arreglo

      // Actualiza los valores de match2, match3 y match4
      if (match2) acc[numero_venta].match2 = true;
      if (match3) acc[numero_venta].match3 = true;
      if (match4) acc[numero_venta].match4 = true;

      return acc;
    }, {});
  };

  // Función para guardar en Supabase solo si el registro es único
  const saveUniqueWins = async () => {
    const groupedMatches = groupMatchesByNumeroVenta(filteredMatches);

    for (const matchKey in groupedMatches) {
      const match = groupedMatches[matchKey];

      const matchData = {
        fecha_hora: match.fecha_hora,
        lottery: match.lottery,
        boleto: match.boletos.join(", "), // Guardar todos los boletos como una cadena
        result: match.result,
        nombre: match.nombre,
        celular: match.celular,
        fecha: match.fecha,
        hora: match.hora,
        match2: match.match2,
        match3: match.match3,
        match4: match.match4,
        numero_venta: match.numero_venta,
        premio: match.premio, // Guardar el premio sumado
        zona: match.zona,
        email: match.email,
      };

      const matchString = JSON.stringify(matchData);

      if (!savedMatches.has(matchString)) {
        const { data, error } = await supabase.from("win").insert([matchData]);

        if (error) {
          console.error("Error saving win data:", error);
        } else {
          console.log("Win data saved successfully:", data);
          setSavedMatches((prev) => new Set(prev).add(matchString));
        }
      } else {
        console.log("Coincidencia ya guardada en la base de datos:", matchData);
      }
    }
  };

  useEffect(() => {
    if (filteredMatches.length > 0) {
      saveUniqueWins();
    }
  }, [filteredMatches]);

  return (
    <>
      <ResultadosComponent />
      <div className="container mx-auto mt-8 p-4">
        <h1 className="text-2xl font-bold mb-4">
          Resultados de Lotería ganadores hoy
        </h1>

        {filteredMatches.length === 0 ? (
          <p>No se encontraron coincidencias para los boletos de hoy.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border-collapse border border-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 border border-gray-300">Lotería</th>
                  <th className="px-4 py-2 border border-gray-300">Boletos</th>
                  <th className="px-4 py-2 border border-gray-300">
                    Resultado
                  </th>

                  <th className="px-4 py-2 border border-gray-300">2 Cifras</th>
                  <th className="px-4 py-2 border border-gray-300">3 Cifras</th>
                  <th className="px-4 py-2 border border-gray-300">4 Cifras</th>
                  <th className="px-4 py-2 border border-gray-300">Combi</th>
                  <th className="px-4 py-2 border border-gray-300">Nombre</th>
                  <th className="px-4 py-2 border border-gray-300">Celular</th>
                  <th className="px-4 py-2 border border-gray-300">Fecha</th>
                  <th className="px-4 py-2 border border-gray-300">Hora</th>
                  <th className="px-4 py-2 border border-gray-300">zona</th>
                  <th className="px-4 py-2 border border-gray-300">Premio</th>
                </tr>
              </thead>
              <tbody>
                {Object.values(groupMatchesByNumeroVenta(filteredMatches)).map(
                  (match, index) => (
                    <tr key={index}>
                      <td className="border px-4 py-2">{match.lottery}</td>
                      <td className="border px-4 py-2">
                        {match.boletos.join(", ")}{" "}
                        {/* Muestra todos los boletos */}
                      </td>
                      <td className="border px-4 py-2">{match.result}</td>

                      <td className="border px-4 py-2">
                        {match.match2 ? "✔️" : "❌"}
                      </td>
                      <td className="border px-4 py-2">
                        {match.match3 ? "✔️" : "❌"}
                      </td>
                      <td className="border px-4 py-2">
                        {match.match4 ? "✔️" : "❌"}
                      </td>
                      <td className="border px-4 py-2">
                        {match.combi > 0 ? "✔️" : "❌"}
                      </td>
                      <td className="border px-4 py-2">{match.nombre}</td>
                      <td className="border px-4 py-2">{match.celular}</td>
                      <td className="border px-4 py-2">{match.fecha}</td>
                      <td className="border px-4 py-2">{match.hora}</td>
                      <td className="border px-4 py-2">{match.zona}</td>
                      <td className="border px-4 py-2">
                        {FormarPesoCop(match.premio)}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
