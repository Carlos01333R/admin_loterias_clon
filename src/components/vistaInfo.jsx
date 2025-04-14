import useVentasUserByFecha from "../hook/useVentasUserByFecha";
import usePremioUserByFecha from "../hook/usePremioUserByFecha";
import useZonas from "../hook/useZona";
import SalesIcon from "../icons/SalesIcon";
import { Button, useDisclosure } from "@nextui-org/react";
import ModalPremiosByUser from "./componentAdminZona/Proyectos/modalPremiosByUser";
import { Card } from "@nextui-org/react";
import VistasVentas from "./vistasVentas";

export default function VistaInfo({ selectUser, fechaSeleccionada, sector }) {
  const { ventas, loading, error, totales } = useVentasUserByFecha(
    fechaSeleccionada,
    fechaSeleccionada,
    selectUser
  );

  const {
    premio,
    loading: loadingPremio,
    error: errorPremio,
  } = usePremioUserByFecha(fechaSeleccionada, fechaSeleccionada, selectUser);

  const { zonas } = useZonas();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

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

  const itemsSale = [
    {
      label: "Venta Bruta",
      value: totales?.total_valor_bruta,
    },
    {
      label: "Venta Neta",
      value: ventaNetaHoyNew,
    },
    {
      label: "premio",
      value: premio,
    },
    {
      label: "Ganancias Admin Zona",
      value: gananciasAdminZonaNew,
    },
    {
      label: "Ganancias Clientes",
      value: gananciasHoyNew,
    },
    {
      label: `total de entregar a ${selectUser}`,
      value: ventaNetaHoyNew + gananciasAdminZonaNew,
    },
  ];

  const formatEuro = (amount) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  const handleOpenModal = () => {
    onOpen(); // Abrir el modal
  };

  return (
    <>
      <section>
        <h2 className="text-xl font-bold text-zinc-900 text-center mt-5">
          ventas de {selectUser}
        </h2>

        {error && <p className="text-red-500">{error.message}</p>}

        {loading ? (
          <p>Cargando...</p>
        ) : (
          <section className="w-full grid grid-cols-1 md:grid-cols-3 gap-x-5 p-3 gap-y-2 md:gap-y-2">
            {itemsSale.map((item) => (
              <Card
                key={item.label}
                className="border-2 border-zinc-200 rounded-lg px-4 h-20 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] flex flex-col justify-center items-center hover:scale-105 transition-all duration-300"
              >
                <div className="flex items-center justify-center mt-0 mb-0">
                  <SalesIcon />
                  <p className="text-sm font-bold text-zinc-900">
                    {item.label}
                  </p>
                </div>
                <p className="font-bold text-xl text-zinc-900">
                  {formatEuro(item.value)}
                </p>
              </Card>
            ))}

            {premio !== 0 && (
              <Card className="border-2 border-zinc-200 rounded-lg p-4 h-20 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] flex flex-col justify-center items-center hover:scale-105 transition-all duration-300">
                <div className="flex items-center">
                  <Button
                    color="success"
                    variant="light"
                    onPress={handleOpenModal}
                  >
                    Ver premios
                  </Button>
                </div>
              </Card>
            )}
          </section>
        )}
      </section>
      <ModalPremiosByUser
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        desde={fechaSeleccionada}
        hasta={fechaSeleccionada}
        email={selectUser}
      />
      {ventas.length > 0 && <VistasVentas ventas={ventas} />}
    </>
  );
}
