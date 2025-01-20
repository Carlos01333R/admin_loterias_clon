import useVentasZonasByFecha from "../../hook/useVentasFechasZonas";
import usePremioByFecha from "../../hook/usePremioByfecha";
import SalesIcon from "../../icons/SalesIcon";
import { Button, useDisclosure } from "@nextui-org/react";
import ModalPremios from "./modalPremios";
import useZonas from "../../hook/useZona";

export default function TotalFechas({ desde, hasta, zona, onClose }) {
  const { ventas, loading, error, totales } = useVentasZonasByFecha(
    desde,
    hasta,
    zona
  );

  const {
    premio,
    loading: loadingPremio,
    error: errorPremio,
  } = usePremioByFecha(desde, hasta, zona);

  const formatPesoCop = (amount) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

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

  const ventaNetaHoyNew = (totales?.valorBruta * adminZonaVentaNeta) / 100;
  const gananciasHoyNew = (totales?.valorBruta * adminZonaGanancias) / 100;
  const gananciasAdminZonaNew = (totales?.valorBruta * adminZona) / 100;

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleOpenModal = () => {
    onOpen(); // Abrir el modal
  };

  const itemsHoy = [
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
      name: "premios",
      subName: "premios general",
      value: formatPesoCop(premio),
      logo: "https://cdn-icons-png.flaticon.com/512/10997/10997932.png",
    },
    {
      name: "Ganancias Admin zona",
      subName: "Ganancias admin general",
      value: formatPesoCop(gananciasAdminZonaNew),
      logo: "https://cdn-icons-png.freepik.com/512/10997/10997932.png",
    },
    {
      name: "Ganancias usuarios",
      subName: "Ganancias usuarios general",
      value: formatPesoCop(gananciasHoyNew),
      logo: "https://cdn-icons-png.flaticon.com/512/10997/10997932.png",
    },
    {
      name: "balance",
      subName: "balance general",
      value: formatPesoCop(ventaNetaHoyNew - premio),
      logo: "https://cdn-icons-png.flaticon.com/512/10997/10997932.png",
    },
  ];

  return (
    <>
      <section>
        <h2 className="text-xl font-bold  text-center mt-5">
          Selecciona las fechas de venta
        </h2>

        {error && <p className="text-red-500">{error.message}</p>}

        {loading ? (
          <p>Cargando...</p>
        ) : (
          <section className="w-full p-4 grid grid-cols-1 md:grid-cols-3 gap-x-5 gap-y-2 md:gap-y-2">
            {itemsHoy.map((item, index) => (
              <div
                key={index}
                className="w-full flex flex-col justify-center items-center bg-white rounded-xl p-3 hover:scale-105 transition duration-300 ease-in-out transform shadow-xl"
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
                    {premio !== undefined &&
                      ventaNetaHoyNew !== undefined &&
                      premio !== 0 && (
                        <p
                          className={`font-bold text-lg ${
                            ventaNetaHoyNew - premio < 0
                              ? "text-red-500"
                              : "text-blue-500"
                          }`}
                        >
                          {item.value}
                        </p>
                      )}
                    {premio === 0 && (
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
            {premio !== 0 && (
              <div className="w-full flex flex-col justify-center items-center bg-white rounded-xl p-3 hover:scale-105 transition duration-300 ease-in-out transform shadow-xl">
                <div className="flex items-center">
                  <Button
                    className="focus:outline-none"
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
      <ModalPremios
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        desde={desde}
        hasta={hasta}
        zona={zona}
      />
    </>
  );
}
