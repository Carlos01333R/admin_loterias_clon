import { useEffect } from "react";
import { supabase } from "../hook/supabaseClient";
import useGanadores from "../hook/ganadores";
import { Toaster } from "sonner";

export default function GanadoresLoterias() {
  const { ganadores, loading, error } = useGanadores();

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (!data.session) {
        window.location.href = "/";
      }
    };

    checkSession();
  }, []);

  return (
    <>
      {error && <p>{error.message || "Ocurrió un error"}</p>}

      {loading ? (
        <h2 className="text-center text-lg font-bold text-zinc-900">
          Cargando...
        </h2>
      ) : (
        <>
          <section className="w-full flex justify-between items-center">
            <h2 className="text-2xl font-bold text-zinc-900 mt-5 mb-10">
              Historial de Ganadores{" "}
            </h2>
          </section>

          {ganadores && ganadores.length === 0 ? (
            <p>No se encontraron ganadores.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border-collapse border border-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border border-gray-300">
                      Lotería
                    </th>
                    <th className="px-4 py-2 border border-gray-300">Boleto</th>
                    <th className="px-4 py-2 border border-gray-300">
                      Resultado
                    </th>
                    <th className="px-4 py-2 border border-gray-300">
                      Coincidencia 2
                    </th>
                    <th className="px-4 py-2 border border-gray-300">
                      Coincidencia 3
                    </th>
                    <th className="px-4 py-2 border border-gray-300">
                      Coincidencia 4
                    </th>
                    <th className="px-4 py-2 border border-gray-300">Nombre</th>
                    <th className="px-4 py-2 border border-gray-300">
                      Celular
                    </th>
                    <th className="px-4 py-2 border border-gray-300">Fecha</th>
                    <th className="px-4 py-2 border border-gray-300">Hora</th>
                    <th className="px-4 py-2 border border-gray-300">Zona</th>
                    <th className="px-4 py-2 border border-gray-300">Premio</th>
                    <th className="px-4 py-2 border border-gray-300">Ticket</th>
                  </tr>
                </thead>
                <tbody>
                  {ganadores.map((match, index) => (
                    <tr key={index}>
                      <td className="border px-4 py-2">{match.lottery}</td>
                      <td className="border px-4 py-2">{match.boleto}</td>
                      <td className="border px-4 py-2">{match.result}</td>
                      <td className="border px-4 py-2">
                        {match.match2 === "true" ? "✔️" : "❌"}
                      </td>
                      <td className="border px-4 py-2">
                        {match.match3 === "true" ? "✔️" : "❌"}
                      </td>
                      <td className="border px-4 py-2">
                        {match.match4 === "true" ? "✔️" : "❌"}
                      </td>
                      <td className="border px-4 py-2">{match.nombre}</td>
                      <td className="border px-4 py-2">{match.celular}</td>
                      <td className="border px-4 py-2">{match.fecha}</td>
                      <td className="border px-4 py-2">{match.hora}</td>
                      <td className="border px-4 py-2">{match.zona}</td>
                      <td className="border px-4 py-2">
                        {new Intl.NumberFormat("es-CO", {
                          style: "currency",
                          currency: "COP",
                        }).format(match.premio)}
                      </td>
                      <td className="border px-4 py-2">
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href={`https://admin-loterias.vercel.app/ticket?ref_venta=${match.numero_venta}`}
                          className="bg-green-500 p-3 rounded-lg text-white"
                        >
                          {match.numero_venta}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
      <Toaster />
    </>
  );
}
