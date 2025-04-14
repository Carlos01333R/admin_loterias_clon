import { useEffect, useState } from "react";
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
  const [fechaFiltro, setFechaFiltro] = useState("");
  const [numeroVentaFiltro, setNumeroVentaFiltro] = useState("");

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
    { name: "Modalidad" },
    { name: "NOMBRE" },
    { name: "CELULAR" },
    { name: "FECHA" },
    { name: "HORA" },
    { name: "ZONA" },
    { name: "PREMIO" },
    { name: "TICKET" },
  ];

  // Función para formatear la fecha en el formato "d/M/yyyy"
  const formatearFecha = (fecha) => {
    const date = new Date(fecha);
    const dia = date.getDate();
    const mes = date.getMonth() + 1; // Los meses van de 0 a 11
    const año = date.getFullYear();
    return `${dia}/${mes}/${año}`;
  };

  // Función para parsear la fecha del filtro
  const parsearFechaFiltro = (fechaString) => {
    if (!fechaString) return null;
    const [year, month, day] = fechaString.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  // Función para parsear la fecha de los ganadores
  const parsearFechaGanador = (fechaString) => {
    if (!fechaString) return null;
    const [day, month, year] = fechaString.split("/").map(Number);
    return new Date(year, month - 1, day);
  };

  // Función para filtrar los ganadores
  const ganadoresFiltrados = ganadores.filter((match) => {
    // Filtrar por fecha
    const fechaMatch = parsearFechaGanador(match.fecha);
    const fechaFiltroDate = parsearFechaFiltro(fechaFiltro);

    const coincideFecha = fechaFiltroDate
      ? fechaMatch && fechaMatch.getTime() === fechaFiltroDate.getTime()
      : true;

    // Filtrar por número de venta
    const coincideNumeroVenta = numeroVentaFiltro
      ? match.numero_venta.includes(numeroVentaFiltro)
      : true;

    return coincideFecha && coincideNumeroVenta;
  });

  return (
    <>
      {error && <p>{error.message || "Ocurrió un error"}</p>}

      {loading ? (
        <h2 className="text-center text-lg font-bold text-zinc-900">
          Cargando...
        </h2>
      ) : (
        <>
          <div className="flex gap-4 mb-6 px-4 py-2">
            {/* Filtro por fecha */}
            <div>
              <label
                htmlFor="fechaFiltro"
                className="block text-sm font-medium text-gray-700"
              >
                Filtrar por fecha:
              </label>
              <input
                type="date"
                id="fechaFiltro"
                value={fechaFiltro}
                onChange={(e) => setFechaFiltro(e.target.value)}
                className="mt-1 p-2 border border-gray-300 rounded-md"
              />
            </div>

            {/* Filtro por número de venta */}
            <div>
              <label
                htmlFor="numeroVentaFiltro"
                className="block text-sm font-medium text-gray-700"
              >
                Filtrar por número de venta:
              </label>
              <input
                type="text"
                id="numeroVentaFiltro"
                value={numeroVentaFiltro}
                onChange={(e) => setNumeroVentaFiltro(e.target.value)}
                placeholder="Ingrese el número de venta"
                className="mt-1 p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
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
            {ganadoresFiltrados.length === 0 ? (
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
                  {ganadoresFiltrados.map((match, index) => (
                    <TableRow key={index}>
                      <TableCell>{match.lottery}</TableCell>
                      <TableCell>{match.boleto}</TableCell>
                      <TableCell>{match.result}</TableCell>
                      <TableCell>
                        {match.match2 === "true" ? " * 2 cifras" : ""}
                        {match.match3 === "true" ? " * 3 cifras" : ""}
                        {match.match4 === "true" ? " * 4 cifras" : ""}
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
