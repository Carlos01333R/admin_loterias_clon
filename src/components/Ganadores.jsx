import { useEffect } from "react";
import { supabase } from "../hook/supabaseClient";
import useGanadores from "../hook/ganadores";
import { Toaster } from "sonner";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";

export default function GanadoresLoterias() {
  const { ganadores, loading, error } = useGanadores();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        window.location.href = "/";
      }
    };

    checkSession();
  }, []);

  const formatSpanishEuro = (amount) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  const columns = [
    { name: "LOTERIA" },
    { name: "BOLETO" },
    { name: "RESULTADO" },
    { name: "COINCIDENCIA 2" },
    { name: "COINCIDENCIA 3" },
    { name: "COINCIDENCIA 4" },
    { name: "NOMBRE" },
    { name: "CELULAR" },
    { name: "FECHA" },
    { name: "HORA" },
    { name: "ZONA" },
    { name: "PREMIO" },
    { name: "TICKET" },
  ];

  return (
    <>
      {error && <p>{error.message || "Ocurrió un error"}</p>}

      {loading ? (
        <h2 className="text-center text-lg font-bold text-zinc-900">
          Cargando...
        </h2>
      ) : (
        <>
          <section className="w-full flex justify-end items-center ">
            <h2 className="text-2xl font-bold mt-5 mb-10 flex items-center gap-x-2 mr-10 ">
              <img
                src="https://cdn-icons-png.flaticon.com/512/9913/9913579.png"
                alt="loteria"
                className="w-8 h-8"
              />
              Historial de Ganadores
            </h2>
          </section>
          <div className="p-4  ">
            {ganadores && ganadores.length === 0 ? (
              <p>No se encontraron ganadores.</p>
            ) : (
              <Table
                style={{
                  backgroundColor: "#000000",
                }}
                isStriped
                aria-label="Tabla de ganadores"
                className=" text-white"
              >
                <TableHeader>
                  {columns.map((col, index) => (
                    <TableColumn
                      style={{
                        backgroundColor: "#000000",
                      }}
                      className="text-white shadow-2xl border-b-2 border-white rounded-xl"
                      key={index}
                    >
                      <p className="flex items-center gap-2 ">{col.name}</p>
                    </TableColumn>
                  ))}
                </TableHeader>
                <TableBody>
                  {ganadores.map((match, index) => (
                    <TableRow key={index}>
                      <TableCell>{match.lottery}</TableCell>
                      <TableCell>{match.boleto}</TableCell>
                      <TableCell>{match.result}</TableCell>
                      <TableCell>
                        {match.match2 === "true" ? "✔️" : "❌"}
                      </TableCell>
                      <TableCell>
                        {match.match3 === "true" ? "✔️" : "❌"}
                      </TableCell>
                      <TableCell>
                        {match.match4 === "true" ? "✔️" : "❌"}
                      </TableCell>
                      <TableCell>{match.nombre}</TableCell>
                      <TableCell>{match.celular}</TableCell>
                      <TableCell>{match.fecha}</TableCell>
                      <TableCell>{match.hora}</TableCell>
                      <TableCell>{match.zona}</TableCell>
                      <TableCell>{formatSpanishEuro(match.premio)}</TableCell>
                      <TableCell>
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href={`https://loteria-ticket-es.vercel.app/ticket?ref_venta=${match.numero_venta}`}
                          className="bg-green-500 p-3 rounded-lg text-white"
                        >
                          {match.numero_venta}
                        </a>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </>
      )}
      <Toaster />
    </>
  );
}
