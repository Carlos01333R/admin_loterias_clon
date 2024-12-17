import useVentasUserByFecha from "../../../hook/useVentasUserByFecha";
import usePremioUserByFecha from "../../../hook/usePremioUserByFecha";
import SalesIcon from "../../../icons/SalesIcon";
import { Button, useDisclosure } from "@nextui-org/react";
import ModalPremiosByUser from "./modalPremiosByUser";
import useZonas from "../../../hook/useZona";

export default function TotalByFechas({ desde, hasta, email, sector }) {
  const { ventas, loading, error, totales } = useVentasUserByFecha(
    desde,
    hasta,
    email
  );

  const {
    premio,
    loading: loadingPremio,
    error: errorPremio,
  } = usePremioUserByFecha(desde, hasta, email);

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

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const formatPesoCop = (value) => {
    if (value == null || isNaN(value)) {
      return "N/A"; // Retorna un valor por defecto si es nulo o no es un número
    }
    return value.toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const handleOpenModal = () => {
    onOpen(); // Abrir el modal
  };

  return (
    <>
      <section>
        <h2 className="text-xl font-bold text-zinc-900 text-center mt-5">
          Selecciona las fechas de venta
        </h2>

        {error && <p className="text-red-500">{error.message}</p>}

        {loading ? (
          <p>Cargando...</p>
        ) : (
          <section className="w-full grid grid-cols-1 md:grid-cols-3 gap-x-5 p-3 gap-y-2 md:gap-y-2">
            <div className="border-2 border-zinc-200 rounded-lg p-4 h-20 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] flex flex-col justify-center items-center hover:scale-105 transition-all duration-300">
              <div className="flex items-center">
                <SalesIcon />
                <p className="text-sm font-bold text-zinc-900">Venta Bruta</p>
              </div>
              <p className="font-bold text-lg text-zinc-900">
                {formatPesoCop(totales?.valorBruta)}
              </p>
            </div>
            <div className="border-2 border-zinc-200 rounded-lg p-4 h-20 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] flex flex-col justify-center items-center hover:scale-105 transition-all duration-300">
              <div className="flex items-center">
                <SalesIcon />
                <p className="text-sm font-bold text-zinc-900">Venta Neta</p>
              </div>
              <p className="font-bold text-lg text-zinc-900">
                {formatPesoCop(ventaNetaHoyNew)}
              </p>
            </div>

            <div className="border-2 border-zinc-200 rounded-lg p-4 h-20 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] flex flex-col justify-center items-center hover:scale-105 transition-all duration-300">
              <div className="flex items-center">
                <SalesIcon />
                <p className="text-sm font-bold text-zinc-900">premio</p>
              </div>
              {errorPremio && <p className="text-red-500">{errorPremio}</p>}
              {loadingPremio && <p>Cargando...</p>}
              {premio && (
                <p className="font-bold text-lg text-zinc-900">
                  {formatPesoCop(premio)}
                </p>
              )}
            </div>

            <div className="border-2 border-zinc-200 rounded-lg p-4 h-20 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] flex flex-col justify-center items-center hover:scale-105 transition-all duration-300">
              <div className="flex items-center">
                <SalesIcon />
                <p className="text-sm font-bold text-zinc-900 truncate">
                  Ganancias Admin Zona
                </p>
              </div>
              <p className="font-bold text-lg text-zinc-900">
                {formatPesoCop(gananciasAdminZonaNew)}
              </p>
            </div>
            <div className="border-2 border-zinc-200 rounded-lg p-4 h-20 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] flex flex-col justify-center items-center hover:scale-105 transition-all duration-300">
              <div className="flex items-center">
                <SalesIcon />
                <p className="text-sm font-bold text-zinc-900">
                  Ganancias Clientes
                </p>
              </div>
              <p className="font-bold text-lg text-zinc-900">
                {formatPesoCop(gananciasHoyNew)}
              </p>
            </div>

            <div className="border-2 border-zinc-200 rounded-lg p-4 h-20 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] flex flex-col justify-center items-center hover:scale-105 transition-all duration-300">
              <div className="flex items-center">
                <p className="text-sm text-center font-bold text-zinc-900">
                  Total de entregar a {email}
                </p>
              </div>
              <p className="font-bold text-lg text-green-500">
                {formatPesoCop(ventaNetaHoyNew + gananciasAdminZonaNew)}
              </p>
            </div>

            <div className="border-2 border-zinc-200 rounded-lg p-4 h-20 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] flex flex-col justify-center items-center hover:scale-105 transition-all duration-300">
              <div className="flex items-center">
                <SalesIcon />
                <p className="text-sm font-bold text-zinc-900">Balance</p>
              </div>
              {errorPremio && <p className="text-red-500">{errorPremio}</p>}
              {loadingPremio && <p>Cargando...</p>}
              {premio !== undefined &&
                totales?.ventaNeta !== undefined &&
                premio !== 0 && (
                  <p
                    className={`font-bold text-lg ${
                      totales.ventaNeta - premio < 0
                        ? "text-red-500"
                        : "text-blue-500"
                    }`}
                  >
                    {formatPesoCop(totales.ventaNeta - premio)}
                  </p>
                )}
              {premio === 0 && (
                <p className="font-bold text-lg text-zinc-900">Sin premio</p>
              )}
            </div>

            {premio !== 0 && (
              <div className="border-2 border-zinc-200 rounded-lg p-4 h-20 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] flex flex-col justify-center items-center hover:scale-105 transition-all duration-300">
                <div className="flex items-center">
                  <Button
                    color="success"
                    variant="light"
                    onPress={handleOpenModal}
                  >
                    Ver premios
                  </Button>
                </div>
              </div>
            )}
          </section>
        )}
      </section>
      <ModalPremiosByUser
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        desde={desde}
        hasta={hasta}
        email={email}
      />
    </>
  );
}
