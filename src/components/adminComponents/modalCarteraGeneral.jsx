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
      timeZone: "Europe/Madrid", // Asegura que uses la zona horaria correcta
    };
    return date.toLocaleDateString("es-ES", options);
  };
  // Función para formatear números a euros

  const formatPesos = (amount) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  const itemsHoy = [
    {
      name: "Venta Bruta",
      subName: "Venta Bruta general",
      value: formatPesos(valorBrutaHoy),
      logo: "https://cdn-icons-png.flaticon.com/512/5305/5305244.png",
    },
    {
      name: "Venta Neta",
      subName: "Venta Neta general",
      value: formatPesos(ventaNetaHoyNew),
      logo: "https://images.vexels.com/media/users/3/147974/isolated/preview/22ed2b8524101426e7b490c95097a8f2-icono-de-ventas-comerciales.png",
    },
    {
      name: "premios",
      subName: "premios general",
      value: formatPesos(totalPremio),
      logo: "https://cdn-icons-png.flaticon.com/512/10997/10997932.png",
    },
    {
      name: "Ganancias Admin zona",
      subName: "Ganancias admin general",
      value: formatPesos(gananciasAdminZonaNew),
      logo: "https://cdn-icons-png.freepik.com/512/10997/10997932.png",
    },
    {
      name: "Ganancias usuarios",
      subName: "Ganancias usuarios general",
      value: formatPesos(gananciasHoyNew),
      logo: "https://cdn-icons-png.flaticon.com/512/10997/10997932.png",
    },
    {
      name: "balance",
      subName: "balance general",
      value: formatPesos(ventaNetaHoyNew - totalPremio),
      logo: "https://cdn-icons-png.flaticon.com/512/10997/10997932.png",
    },
  ];

  return (
    <>
      <Modal
        size="2xl"
        scrollBehavior="inside"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop="blur"
        className="bg-[#F4F6FA]"
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
                    <section className="w-full flex justify-center items-center ">
                      <p className="text-center font-bold flex items-center text-lg">
                        <img
                          src="https://cdn-icons-png.flaticon.com/512/5305/5305244.png"
                          alt=""
                          className="w-8 h-8"
                        />
                        Totales de Ventas para la Zona {zona}
                      </p>
                    </section>

                    <section className="w-full p-4 grid grid-cols-1 md:grid-cols-3 gap-x-5  gap-y-2 md:gap-y-2">
                      <div className="w-full flex flex-col justify-center items-center  bg-white rounded-xl p-3  hover:scale-105 transition duration-300 ease-in-out transform shadow-[0px_5px_17px_-1px_rgba(204,204,204,0.65)]">
                        <p className="text-lg font-bold text-zinc-900 truncate">
                          Venta bruta
                        </p>
                        <p className="font-extrabold text-[#3DB078] text-2xl truncate">
                          {formatPesos(data[0].total_valor_bruta || 0)}
                        </p>
                        <small className="text-xs-small text-[#F5BE40]">
                          Venta Bruta general
                        </small>
                      </div>
                      <div className="w-full flex flex-col justify-center items-center  bg-white rounded-xl p-3  hover:scale-105 transition duration-300 ease-in-out transform shadow-[0px_5px_17px_-1px_rgba(204,204,204,0.65)]">
                        <p className="text-lg font-bold text-zinc-900 truncate">
                          Venta Neta
                        </p>
                        <p className="font-extrabold text-[#3DB078] text-2xl truncate">
                          {formatPesos(
                            (data[0].total_valor_bruta * adminZonaVentaNeta) /
                              100 || 0
                          )}
                        </p>
                        <small className="text-xs-small text-[#F5BE40]">
                          Venta Neta general
                        </small>
                      </div>
                      <div className="w-full flex flex-col justify-center items-center  bg-white rounded-xl p-3  hover:scale-105 transition duration-300 ease-in-out transform shadow-[0px_5px_17px_-1px_rgba(204,204,204,0.65)]">
                        <p className="text-lg font-bold text-zinc-900 truncate">
                          Ganancias Admin zona
                        </p>
                        <p className="font-extrabold text-[#3DB078] text-2xl truncate">
                          {formatPesos(
                            (data[0].total_valor_bruta * adminZona) / 100
                          )}
                        </p>
                        <small className="text-xs-small text-[#F5BE40]">
                          Ganancias Admin zona general
                        </small>
                      </div>
                      <div className="w-full flex flex-col justify-center items-center  bg-white rounded-xl p-3  hover:scale-105 transition duration-300 ease-in-out transform shadow-[0px_5px_17px_-1px_rgba(204,204,204,0.65)]">
                        <p className="text-lg font-bold text-zinc-900 truncate">
                          Ganancias Clientes
                        </p>
                        <p className="font-extrabold text-[#3DB078] text-2xl truncate">
                          {formatPesos(
                            (data[0].total_valor_bruta * adminZonaGanancias) /
                              100 || 0
                          )}
                        </p>
                        <small className="text-xs-small text-[#F5BE40]">
                          Ganancias Clientes general
                        </small>
                      </div>
                    </section>

                    <section className="w-full flex justify-center items-center ">
                      <p className="text-center font-bold flex items-center text-lg">
                        <img
                          src="https://cdn-icons-png.flaticon.com/512/5305/5305244.png"
                          alt=""
                          className="w-8 h-8"
                        />
                        Ventas Hoy
                      </p>
                    </section>

                    <section className="w-full p-4 grid grid-cols-1 md:grid-cols-3 gap-x-5 gap-y-2 md:gap-y-2">
                      {itemsHoy.map((item, index) => (
                        <div
                          key={index}
                          className="w-full flex flex-col justify-center items-center bg-white rounded-xl p-3 hover:scale-105 transition duration-300 ease-in-out transform shadow-[0px_5px_17px_-1px_rgba(204,204,204,0.65)]"
                        >
                          {/* Nombre del item */}
                          <p className="text-lg font-bold text-zinc-900 truncate">
                            {item.name}
                          </p>

                          {/* Renderizado especial para balance */}
                          {item.name === "balance" ? (
                            <>
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
                                  Sin balance
                                </p>
                              )}
                            </>
                          ) : (
                            // Valor normal para los demás items
                            <p className="font-extrabold text-[#3DB078] text-2xl truncate">
                              {item.value}
                            </p>
                          )}

                          {/* Subtítulo */}
                          <small className="text-xs-small text-[#F5BE40]">
                            {item.subName}
                          </small>
                        </div>
                      ))}
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
                  <h2 className="text-xl font-bold  text-center mt-5s">
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
