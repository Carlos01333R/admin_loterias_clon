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

  const FormarPesoCop = (amount) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  const FormarPesoCopString = (value) => {
    // Convertir el string a número (float o int)
    const numericValue =
      typeof value === "string"
        ? parseFloat(value.replace(/[^\d.-]/g, "")) || 0
        : Number(value) || 0;

    return numericValue.toLocaleString("es-ES", {
      style: "currency",
      currency: "EUR",
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
        // Verificar si ya existe un registro con la misma fecha_hora
        const { data: existingRecord, error: fetchError } = await supabase
          .from("win")
          .select("*")
          .eq("fecha_hora", matchData.fecha_hora)
          .single();

        if (fetchError && fetchError.code !== "PGRST116") {
          // PGRST116 es el código para "no rows found"
          console.error("Error fetching existing record:", fetchError);
          continue;
        }

        if (existingRecord) {
          // Si el registro existe y los valores de boleto o premio son diferentes, actualiza el registro
          if (
            existingRecord.boleto !== matchData.boleto ||
            existingRecord.premio !== matchData.premio
          ) {
            const { data: updatedRecord, error: updateError } = await supabase
              .from("win")
              .update(matchData)
              .eq("fecha_hora", matchData.fecha_hora);

            if (updateError) {
              console.error("Error updating win data:", updateError);
            } else {
              console.log("Win data updated successfully:", updatedRecord);
              setSavedMatches((prev) => new Set(prev).add(matchString));
            }
          } else {
            console.log(
              "Coincidencia ya guardada en la base de datos:",
              matchData
            );
          }
        } else {
          // Si no existe, inserta el nuevo registro
          const { data, error } = await supabase
            .from("win")
            .insert([matchData]);

          if (error) {
            console.error("Error saving win data:", error);
          } else {
            console.log("Win data saved successfully:", data);
            setSavedMatches((prev) => new Set(prev).add(matchString));
          }
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

                  <th className="px-4 py-2 border border-gray-300">
                    Modalidad
                  </th>
                  <th className="px-4 py-2 border border-gray-300">Valor</th>
                  <th className="px-4 py-2 border border-gray-300">Nombre</th>
                  <th className="px-4 py-2 border border-gray-300">Celular</th>
                  <th className="px-4 py-2 border border-gray-300">Fecha</th>
                  <th className="px-4 py-2 border border-gray-300">Hora</th>
                  <th className="px-4 py-2 border border-gray-300">zona</th>
                  <th className="px-4 py-2 border border-gray-300">vendedor</th>
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
                        {match.match2 ? " 2 cifras" : ""}
                        {match.match3 ? " 3 cifras" : ""}
                        {match.match4 ? " 4 cifras" : ""}
                        {match.combi > 0 ? " Con Combi" : ""}
                      </td>
                      <td className="border px-4 py-2">
                        {FormarPesoCopString(match.venta)}
                      </td>
                      <td className="border px-4 py-2">{match.nombre}</td>
                      <td className="border px-4 py-2">{match.celular}</td>
                      <td className="border px-4 py-2">{match.fecha}</td>
                      <td className="border px-4 py-2">{match.hora}</td>
                      <td className="border px-4 py-2">{match.zona}</td>
                      <td className="border px-4 py-2">{match.email}</td>
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
