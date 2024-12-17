import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import useVentasPorZona from "../../hook/useSalesDataZona";
import Form from "./form";
import TotalFechas from "./totalFechas";
import { useState } from "react";
import useVentasHoyAdminZona from "../../hook/ventasHoyAdminZona";
import SalesIcon from "../../icons/SalesIcon";
import useZonas from "../../hook/useZona";
import useTotalPremioPorZona from "../../hook/usePremioHoyZona";

export default function ModalCarteraGeneral({ isOpen, onOpenChange, zona }) {
  const { data, loading, error } = useVentasPorZona(zona);
  const { valorBrutaHoy, ventaNetaHoy, gananciasHoy } = useVentasHoyAdminZona({
    sector: zona,
  });

  const {
    totalPremio,
    loading: loadingPremio,
    error: errorPremio,
  } = useTotalPremioPorZona(zona);
  console.log(totalPremio);

  const { zonas } = useZonas();
  const adminZona = zonas
    ? zonas.find((z) => z.nombre === zona)?.porcentaje_admin_zona
    : null;

  const adminZonaVentaNeta = zonas
    ? zonas.find((z) => z.nombre === zona)?.porcentaje_loteria
    : null;

  const adminZonaGanancias = zonas
    ? zonas.find((z) => z.nombre === zona)?.porcentaje_cliente
    : null;

  const ventaNetaHoyNew = (valorBrutaHoy * adminZonaVentaNeta) / 100;
  const gananciasHoyNew = (valorBrutaHoy * adminZonaGanancias) / 100;
  const gananciasAdminZonaNew = (valorBrutaHoy * adminZona) / 100;

  const [desde, setDesde] = useState(null);
  const [hasta, setHasta] = useState(null);

  const formatDate = (date) => {
    if (!date) return "";
    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "UTC",
    };
    return date.toLocaleDateString("es-ES", options);
  };

  // Función para formatear números a pesos colombianos
  const formatPesos = (value) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
    }).format(value);
  };

  return (
    <>
      <Modal
        size="2xl"
        scrollBehavior="inside"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody>
                {/* Mostramos un mensaje de carga si está cargando */}
                {loading && <p className="text-gray-500">Cargando datos...</p>}

                {/* Mostramos un error si existe */}
                {error && <p className="text-red-500">Error: {error}</p>}

                {/* Mostramos los resultados si hay datos */}
                {data && data.length > 0 ? (
                  <>
                    <h5 className="text-center font-bold">
                      Totales de Ventas para la Zona {zona}
                    </h5>
                    <section className="w-full grid grid-cols-1 md:grid-cols-3 gap-x-5 p-3 gap-y-2 md:gap-y-0">
                      <div className="border-2 border-zinc-200 rounded-lg p-4  h-20 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] flex flex-col justify-center items-center hover:scale-105 transition-all duration-300">
                        <div className="flex items-center ">
                          <SalesIcon />
                          <p className="text-sm font-bold text-zinc-900">
                            Venta Bruta
                          </p>
                        </div>
                        <p className="font-bold text-zinc-900 text-lg">
                          {formatPesos(data[0].total_valor_bruta || 0)}
                        </p>
                      </div>
                      <div className="border-2 border-zinc-200 rounded-lg p-4 h-20 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] flex flex-col justify-center items-center hover:scale-105 transition-all duration-300">
                        <div className="flex items-center ">
                          <SalesIcon />
                          <p className="text-sm font-bold text-zinc-900">
                            Venta Neta
                          </p>
                        </div>
                        <p className="font-bold text-zinc-900 text-lg">
                          {formatPesos(
                            (data[0].total_valor_bruta * adminZonaVentaNeta) /
                              100 || 0
                          )}
                        </p>
                      </div>

                      <div className="border-2 border-zinc-200 rounded-lg p-4 h-20 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] flex flex-col justify-center items-center hover:scale-105 transition-all duration-300">
                        <div className="flex items-center ">
                          <SalesIcon />
                          <p className="text-sm font-bold text-zinc-900 truncate">
                            Ganancias Admin zona
                          </p>
                        </div>
                        <p className="font-bold text-zinc-900 text-lg">
                          {formatPesos(
                            (data[0].total_valor_bruta * adminZona) / 100
                          )}
                        </p>
                      </div>

                      <div className="border-2 border-zinc-200 rounded-lg p-4 h-20 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] flex flex-col justify-center items-center hover:scale-105 transition-all duration-300">
                        <div className="flex items-center ">
                          <SalesIcon />
                          <p className="text-sm font-bold text-zinc-900">
                            Ganancias Clientes
                          </p>
                        </div>
                        <p className="font-bold text-zinc-900 text-lg">
                          {formatPesos(
                            (data[0].total_valor_bruta * adminZonaGanancias) /
                              100 || 0
                          )}
                        </p>
                      </div>
                    </section>

                    <h5 className="text-center font-bold">Ventas Hoy</h5>
                    <section className="w-full grid grid-cols-1 md:grid-cols-3 gap-x-5 p-3 gap-y-2 md:gap-y-0">
                      <div className="border-2 border-zinc-200 rounded-lg p-4  h-20 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] flex flex-col justify-center items-center hover:scale-105 transition-all duration-300">
                        <div className="flex items-center ">
                          <SalesIcon />
                          <p className="text-sm font-bold text-zinc-900">
                            Venta Bruta
                          </p>
                        </div>
                        <p className="font-bold text-zinc-900 text-lg">
                          {formatPesos(valorBrutaHoy)}
                        </p>
                      </div>
                      <div className="border-2 border-zinc-200 rounded-lg p-4 h-20 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] flex flex-col justify-center items-center hover:scale-105 transition-all duration-300">
                        <div className="flex items-center ">
                          <SalesIcon />
                          <p className="text-sm font-bold text-zinc-900">
                            Venta Neta
                          </p>
                        </div>
                        <p className="font-bold text-zinc-900 text-lg">
                          {formatPesos(ventaNetaHoyNew)}
                        </p>
                      </div>

                      <div className="border-2 border-zinc-200 rounded-lg p-4 h-20 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] flex flex-col justify-center items-center hover:scale-105 transition-all duration-300">
                        <div className="flex items-center ">
                          <SalesIcon />
                          <p className="text-sm font-bold text-zinc-900">
                            Premios
                          </p>
                        </div>
                        <p className="font-bold text-zinc-900 text-lg">
                          {formatPesos(totalPremio)}
                        </p>
                      </div>
                      <div className="border-2 border-zinc-200 rounded-lg p-4 h-20 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] flex flex-col justify-center items-center hover:scale-105 transition-all duration-300">
                        <div className="flex items-center">
                          <SalesIcon />
                          <p className="text-sm font-bold text-zinc-900 truncate">
                            {" "}
                            Ganancias Admin zona
                          </p>
                        </div>
                        <p className="font-bold text-zinc-900 text-lg">
                          {formatPesos(gananciasAdminZonaNew)}
                        </p>
                      </div>
                      <div className="border-2 border-zinc-200 rounded-lg p-4 h-20 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] flex flex-col justify-center items-center hover:scale-105 transition-all duration-300">
                        <div className="flex items-center ">
                          <SalesIcon />
                          <p className="text-sm font-bold text-zinc-900">
                            Ganancias Clientes
                          </p>
                        </div>
                        <p className="font-bold text-zinc-900 text-lg">
                          {formatPesos(gananciasHoyNew)}
                        </p>
                      </div>

                      <div className="border-2 border-zinc-200 rounded-lg p-4 h-20 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] flex flex-col justify-center items-center hover:scale-105 transition-all duration-300">
                        <div className="flex items-center ">
                          <SalesIcon />
                          <p className="text-sm font-bold text-zinc-900">
                            balance
                          </p>
                        </div>
                        {errorPremio && (
                          <p className="text-red-500">{errorPremio}</p>
                        )}
                        {loadingPremio && <p>Cargando...</p>}
                        {totalPremio !== undefined &&
                          ventaNetaHoyNew !== undefined &&
                          totalPremio !== 0 && (
                            <p
                              className={`font-bold text-lg ${
                                ventaNetaHoyNew - totalPremio < 0
                                  ? "text-red-500"
                                  : "text-blue-500"
                              }`}
                            >
                              {formatPesos(ventaNetaHoyNew - totalPremio)}
                            </p>
                          )}
                        {totalPremio === 0 && (
                          <p className="font-bold text-lg text-zinc-900">
                            Sin premio
                          </p>
                        )}
                      </div>
                    </section>
                  </>
                ) : (
                  <p className="text-gray-500">No hay datos disponibles.</p>
                )}

                <section className="w-full mb-5">
                  <Form desde={setDesde} hasta={setHasta} />
                </section>

                {desde !== null && hasta !== null ? (
                  <>
                    <section>
                      <TotalFechas
                        desde={formatDate(desde)}
                        hasta={formatDate(hasta)}
                        zona={zona}
                        onClose={onClose}
                      />
                    </section>
                  </>
                ) : (
                  <h2 className="text-xl font-bold text-zinc-900 text-center mt-5s">
                    Selecciona las fechas de venta
                  </h2>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cerrar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
