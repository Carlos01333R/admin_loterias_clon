import { useState, useEffect } from "react";
import SalesIcon from "../../icons/SalesIcon";
import useFechaAdminZona from "../../hook/ventasFechaAdminZona";
import useTotalesPorVendedorZona from "../../hook/useVentasVendedorZonas";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import IconDescription from "../../icons/IconDescription";
import IconName from "../../icons/IconName";
import * as XLSX from "xlsx";
import usePremioUserByFechaTable from "../../hook/usePremioUserByFechaTabla";
import useZonas from "../../hook/useZona";

export default function Ticket({ fechaInicio, fechaFin, sector }) {
  console.log(fechaInicio, fechaFin);
  const [search, setSearch] = useState("");
  const [vendedores, setVendedores] = useState([]);

  const { ventas, loading, error, totales } = useFechaAdminZona(
    fechaInicio,
    fechaFin
  );

  const {
    totalesPorVendedor,
    loading: loadingTotales,
    error: errorTotales,
  } = useTotalesPorVendedorZona(fechaInicio, fechaFin, sector);

  const {
    premiosPorEmail,
    loading: loadingPremios,
    error: errorPremios,
  } = usePremioUserByFechaTable(fechaInicio, fechaFin, vendedores);

  const { zonas } = useZonas();

  const adminZona = zonas
    ? zonas.find((z) => z.nombre === sector)?.porcentaje_admin_zona
    : null;

  const adminZonaVentaNeta = zonas
    ? zonas.find((z) => z.nombre === sector)?.porcentaje_loteria
    : null;

  const adminZonaGanancias = zonas
    ? zonas.find((z) => z.nombre === sector)?.porcentaje_cliente
    : null;

  const ventaNetaHoyNew = (totales?.valorBruta * adminZonaVentaNeta) / 100;
  const gananciasHoyNew = (totales?.valorBruta * adminZonaGanancias) / 100;
  const gananciasAdminZonaNew = (totales?.valorBruta * adminZona) / 100;

  useEffect(() => {
    if (totalesPorVendedor && Object.keys(totalesPorVendedor).length > 0) {
      const emails = Object.keys(totalesPorVendedor);
      setVendedores(emails);
    }
  }, [totalesPorVendedor]);

  const formatPesoCop = (amount) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  const FilterNumeroTicket = (ventas) => {
    if (ventas.length > 0) {
      return ventas.filter((venta) =>
        venta.numero_venta.toLowerCase().includes(search.toLowerCase())
      );
    } else {
      return ventas;
    }
  };

  const FilterTicket = FilterNumeroTicket(ventas);

  const premiosTotales = Object.values(premiosPorEmail).reduce(
    (acc, premio) => acc + (premio || 0),
    0
  );
  const balanceTotal = Object.keys(totalesPorVendedor).reduce(
    (acc, vendedor) => {
      const total = totalesPorVendedor[vendedor].valorBruta;
      const premio = premiosPorEmail[vendedor] || 0;
      return acc + (total * adminZonaVentaNeta) / 100 - premio;
    },
    0
  );

  const exportToExcel = () => {
    const data = Object.keys(totalesPorVendedor).map((vendedor) => ({
      Vendedor: vendedor,
      "Valor Bruta": totalesPorVendedor[vendedor].valorBruta,
      "Venta Neta":
        (totalesPorVendedor[vendedor].valorBruta * adminZonaVentaNeta) / 100 +
        (totalesPorVendedor[vendedor].valorBruta * adminZona) / 100,
      Premios: premiosPorEmail[vendedor] || "N/A",
      "Balance Final":
        (totalesPorVendedor[vendedor].valorBruta * adminZonaVentaNeta) / 100 +
        (totalesPorVendedor[vendedor].valorBruta * adminZona) / 100 -
        (premiosPorEmail[vendedor] || 0),
    }));

    // Añadir fila de totales
    data.push({
      Vendedor: "Total",
      "Valor Bruta": Object.values(totalesPorVendedor).reduce(
        (acc, v) => acc + v.valorBruta,
        0
      ),
      "Venta Neta": Object.keys(totalesPorVendedor).reduce(
        (acc, key) =>
          acc +
          (totalesPorVendedor[key].valorBruta * adminZonaVentaNeta) / 100 +
          (totalesPorVendedor[key].valorBruta * adminZona) / 100,
        0
      ),
      Premios: premiosTotales,
      "Balance Final": Object.keys(totalesPorVendedor).reduce(
        (acc, key) =>
          acc +
          (totalesPorVendedor[key].valorBruta * adminZonaVentaNeta) / 100 +
          (totalesPorVendedor[key].valorBruta * adminZona) / 100 -
          (premiosPorEmail[key] || 0),
        0
      ),
    });

    const worksheet = XLSX.utils.json_to_sheet(data);

    const columnWidths = [
      { wch: 20 }, // Vendedor
      { wch: 15 }, // Valor Bruta
      { wch: 15 }, // Venta Neta
      { wch: 15 }, // Premios
      { wch: 15 }, // Balance Final
    ];
    worksheet["!cols"] = columnWidths;

    // Formato de la primera fila (encabezados)
    Object.keys(worksheet).forEach((key) => {
      if (
        key.startsWith("A1") ||
        key.startsWith("B1") ||
        key.startsWith("C1") ||
        key.startsWith("D1") ||
        key.startsWith("E1")
      ) {
        worksheet[key].s = {
          font: { bold: true, color: { rgb: "FFFFFF" } },
          fill: { fgColor: { rgb: "4F81BD" } },
          alignment: { horizontal: "center" },
        };
      }
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "TotalesPorVendedor");

    XLSX.writeFile(workbook, "TotalesPorVendedor.xlsx");
  };

  const columns = [
    { name: "VENDEDOR", icon: IconName },
    { name: "VENTA BRUTA", icon: IconDescription },
    { name: "VENTA NETA", icon: IconDescription },
    { name: "PREMIOS", icon: IconDescription }, // Nueva columna para los premios
    { name: "BALANCE", icon: IconDescription }, // Nueva columna para los premios
  ];

  const itemsFecha = [
    {
      name: "Venta Bruta",
      subName: "Venta Bruta general",
      value: formatPesoCop(totales?.valorBruta),
      logo: "https://cdn-icons-png.flaticon.com/512/5305/5305244.png",
    },
    {
      name: "Venta Neta",
      subName: "Venta Neta general",
      value: formatPesoCop(ventaNetaHoyNew),
      logo: "https://images.vexels.com/media/users/3/147974/isolated/preview/22ed2b8524101426e7b490c95097a8f2-icono-de-ventas-comerciales.png",
    },
    {
      name: "Ganancias usuario",
      subName: "Ganancias usuario general",
      value: formatPesoCop(gananciasHoyNew),
      logo: "https://cdn-icons-png.freepik.com/512/10997/10997932.png",
    },
    {
      name: "Ganancias admin zona",
      subName: "Ganancias admin general",
      value: formatPesoCop(gananciasAdminZonaNew),
      logo: "https://cdn-icons-png.flaticon.com/512/5305/5305244.png",
    },
  ];

  if (loading) {
    return <p className="text-center text-zinc-900 font-bold">Cargando...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }
  return (
    <>
      <section className="w-full p-4 grid grid-cols-1 md:grid-cols-3 gap-x-5  gap-y-2 md:gap-y-2">
        {itemsFecha.map((item, index) => (
          <div
            key={index}
            className="w-full flex  bg-white rounded-xl p-3  hover:scale-105 transition duration-300 ease-in-out transform shadow-xl"
          >
            <div className="flex flex-col w-[70%] px-6">
              <p className="text-lg font-bold text-zinc-900">{item.name}</p>
              <p className="font-extrabold text-[#3DB078] text-3xl truncate">
                {item.value}
              </p>
              <small className="text-xs-small text-[#F5BE40]">
                {item.subName}
              </small>
            </div>
            <div className="w-[30%]">
              <img src={item.logo} alt="ventas" className="h-16" />
            </div>
          </div>
        ))}
      </section>

      <div className="flex justify-end mb-4 w-full px-4 mt-2 ">
        <button
          onClick={exportToExcel}
          className="px-4 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-700"
        >
          Descargar en Excel
        </button>
      </div>

      <Table
        style={{
          backgroundColor: "#000000",
        }}
        isStriped
        className="text-white rounded-xl w-full md:max-w-[1200px] mx-auto p-0 m-0"
        aria-label="Example static collection table"
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
              <p className="flex items-center gap-2">
                {col.name} {col.icon && <col.icon />}
              </p>
            </TableColumn>
          ))}
        </TableHeader>

        <TableBody>
          {Object.keys(totalesPorVendedor).map((key) => (
            <TableRow key={key}>
              <TableCell>{key}</TableCell>
              <TableCell>
                {formatPesoCop(totalesPorVendedor[key].valorBruta)}
              </TableCell>
              <TableCell>
                {formatPesoCop(
                  (totalesPorVendedor[key].valorBruta * adminZonaVentaNeta) /
                    100 +
                    (totalesPorVendedor[key].valorBruta * adminZona) / 100
                )}
              </TableCell>
              <TableCell>{premiosPorEmail[key]}</TableCell>
              <TableCell>
                {formatPesoCop(
                  (totalesPorVendedor[key].valorBruta * adminZonaVentaNeta) /
                    100 +
                    (totalesPorVendedor[key].valorBruta * adminZona) / 100 -
                    (premiosPorEmail[key] || 0)
                )}
              </TableCell>
            </TableRow>
          ))}
          {/* Fila de Totales */}
          <TableRow>
            <TableCell>Total</TableCell>
            <TableCell>
              {formatPesoCop(
                Object.values(totalesPorVendedor).reduce(
                  (acc, v) => acc + v.valorBruta,
                  0
                )
              )}
            </TableCell>
            <TableCell>
              {formatPesoCop(
                Object.keys(totalesPorVendedor).reduce(
                  (acc, key) =>
                    acc +
                    (totalesPorVendedor[key].valorBruta * adminZonaVentaNeta) /
                      100 +
                    (totalesPorVendedor[key].valorBruta * adminZona) / 100,
                  0
                )
              )}
            </TableCell>
            <TableCell>{formatPesoCop(premiosTotales)}</TableCell>
            <TableCell>
              {formatPesoCop(
                Object.keys(totalesPorVendedor).reduce(
                  (acc, key) =>
                    acc +
                    (totalesPorVendedor[key].valorBruta * adminZonaVentaNeta) /
                      100 +
                    (totalesPorVendedor[key].valorBruta * adminZona) / 100 -
                    (premiosPorEmail[key] || 0),
                  0
                )
              )}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <section className="w-full flex justify-end items-center">
        <form className="mr-5 md:mr-10">
          <input
            type="text"
            placeholder="Buscar por ticket..."
            className="border-b-2 border-zinc-900 rounded-lg p-2 text-black"
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
      </section>

      <section className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-5 p-3 gap-y-2 md:gap-y-0">
        {ventas.length > 0 && FilterTicket.length > 0 ? (
          FilterTicket.map((venta, index) => (
            <div key={index}>
              <article className=" bg-white shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] flex flex-col justify-end items-center rounded-xl mt-3 ">
                <div className="w-full flex justify-between items-center p-2 rounded-lg">
                  <p className="bg-zinc-900 text-white rounded-lg px-1">
                    {venta.fecha} - {venta.hora}
                  </p>
                  <p className="text-green-600 font-bold ">
                    {" "}
                    #Venta {venta.numero_venta}
                  </p>
                </div>
                <div className="w-full flex justify-between items-center p-2 rounded-lg">
                  <article className="flex flex-col justify-center items-center">
                    <p className="font-bold text-lg">Tipo</p>
                    <p className="bg-green-500 p-1 px-1 rounded-lg text-white">
                      {venta.juego}
                    </p>
                  </article>
                  <article className="flex flex-col justify-center items-center">
                    <p className="font-bold text-lg">Venta</p>
                    <p> {formatPesoCop(venta.valor_bruta)}</p>
                  </article>
                  <article className="flex flex-col justify-center items-center">
                    <p className="font-bold text-lg">Cliente</p>
                    <div className="flex flex-col justify-center items-center">
                      <p>{venta.nombre} </p>
                      <p>{venta.celular}</p>
                    </div>
                  </article>
                </div>

                <div className="w-full flex justify-center items-center mt-1 mb-2">
                  <a
                    href={`https://loteria-ticket-es.vercel.app/ticket?ref_venta=${venta.numero_venta}`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-zinc-900 text-white rounded-lg px-1 py-2 text-sm"
                  >
                    Descargar el ticket
                  </a>
                </div>
              </article>
            </div>
          ))
        ) : (
          <p>No hay ventas para este periodo</p>
        )}
      </section>
    </>
  );
}
