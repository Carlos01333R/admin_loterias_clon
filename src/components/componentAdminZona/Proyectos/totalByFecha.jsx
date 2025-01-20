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

  const ventaNetaHoyNew =
    (totales?.total_valor_bruta * adminZonaVentaNeta) / 100;
  const gananciasHoyNew =
    (totales?.total_valor_bruta * adminZonaGanancias) / 100;
  const gananciasAdminZonaNew = (totales?.total_valor_bruta * adminZona) / 100;

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const formatPesoCop = (amount) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  const handleOpenModal = () => {
    onOpen(); // Abrir el modal
  };

  const itemsFecha = [
    {
      name: "Venta Bruta",
      subName: "Venta Bruta general",
      value: formatPesoCop(totales?.total_valor_bruta),
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
      name: "total a entregar",
      subName: "total a entregar",
      value: formatPesoCop(ventaNetaHoyNew + gananciasAdminZonaNew),
      logo: "https://cdn-icons-png.flaticon.com/512/10997/10997932.png",
    },
    {
      name: "balance",
      subName: "balance general",
      value: formatPesoCop(totales.ventaNeta - premio),
      logo: "https://cdn-icons-png.flaticon.com/512/10997/10997932.png",
    },
  ];

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
          <section className="w-full p-4 grid grid-cols-1 md:grid-cols-3 gap-x-5 gap-y-2 md:gap-y-2">
            {itemsFecha.map((item, index) => (
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
