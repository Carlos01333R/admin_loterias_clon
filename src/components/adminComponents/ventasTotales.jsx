import SalesIcon from "../../icons/SalesIcon";
import useSumVentas from "../../hook/cartera";
import useAdminZona from "../../hook/adminZona";
import { supabase } from "../../hook/supabaseClient";
import { useEffect, useState } from "react";
import { useDisclosure } from "@nextui-org/react";
import ModalCarteraGeneral from "./modalCarteraGeneral";
import useZonas from "../../hook/useZona";
import useVentasGeneralesHoy from "../../hook/VentasGenaralesHoy";

export default function VentasTotales() {
  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (!data.session) {
        // Redirige a la página de login si no hay sesión
        window.location.href = "/";
      }
    };

    checkSession();
  }, []);

  const { data, error, loading } = useSumVentas();
  const [sector, setSector] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { zonas, loading: loadingZonas, error: errorZonas } = useZonas();
  const {
    ventas,
    loading: loadingVentas,
    error: errorVentas,
  } = useVentasGeneralesHoy();
  console.log(ventas);

  const {
    adminZona,
    loading: loadingAdmin,
    error: errorAdmin,
  } = useAdminZona();

  const VentaBruta = data?.[0]?.total_valor_bruta ?? 0;
  const Ganancias = data?.[0]?.total_venta_neta ?? 0;
  const GananciasCliente = data?.[0]?.total_ganancias ?? 0;

  const formatPesoCop = (value) => {
    return value.toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const handleOpenModal = (zona) => {
    setSector(zona); // Establecer el correo electrónico del usuario
    onOpen(); // Abrir el modal
  };

  if (loading) {
    return <p>Cargando...</p>;
  }

  return (
    <>
      <h2 className="text-2xl font-bold text-center text-zinc-900 mt-3 underline">
        Ventas Totales
      </h2>
      {error && <p className="text-red-500">{error.message}</p>}
      <section className="w-full grid grid-cols-1 md:grid-cols-3 gap-x-5 p-3 gap-y-2 md:gap-y-0">
        <div className="border-2 border-zinc-200 rounded-lg p-4  h-20 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] flex flex-col justify-center items-center hover:scale-105 transition-all duration-300">
          <div className="flex items-center ">
            <SalesIcon />
            <p className="text-sm font-bold text-zinc-900">Venta Bruta</p>
          </div>
          <p className="font-bold text-zinc-900 text-xl">
            {formatPesoCop(VentaBruta)}
          </p>
        </div>
        <div className="border-2 border-zinc-200 rounded-lg p-4 h-20 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] flex flex-col justify-center items-center hover:scale-105 transition-all duration-300">
          <div className="flex items-center ">
            <SalesIcon />
            <p className="text-sm font-bold text-zinc-900">Venta Neta</p>
          </div>
          <p className="font-bold text-zinc-900 text-xl">
            {formatPesoCop(Ganancias)}
          </p>
        </div>
        <div className="border-2 border-zinc-200 rounded-lg p-4 h-20 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] flex flex-col justify-center items-center hover:scale-105 transition-all duration-300">
          <div className="flex items-center ">
            <SalesIcon />
            <p className="text-sm font-bold text-zinc-900">
              Ganancias Clientes
            </p>
          </div>
          <p className="font-bold text-zinc-900 text-xl">
            {formatPesoCop(GananciasCliente)}
          </p>
        </div>
      </section>

      <section className="mt-3 w-full flex flex-col justify-center items-center ">
        <h2 className="text-2xl font-bold text-center text-zinc-900 mt-3 underline">
          Sectores de Ventas
        </h2>

        {errorZonas && <p className="text-red-500">{errorZonas.message}</p>}
        {loadingZonas ? (
          <p>Cargando...</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "10px",
              width: "100%",
              padding: "10px",
            }}
          >
            {zonas.map((zona, index) => {
              return (
                <button
                  onClick={() => handleOpenModal(zona.nombre)}
                  key={index}
                  className="w-auto h-auto bg-zinc-100 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] flex flex-col justify-end items-center hover:scale-105 transition-all duration-300 rounded-xl mt-3 "
                >
                  <img
                    src="https://trayectoriasenviaje.com/wp-content/uploads/2022/05/que-hacer-cartagena-entrada_ciudad_amurallada.jpg"
                    alt="zona"
                    className="rounded-t-xl"
                  />
                  <p className="text-lg font-bold text-zinc-900 p-3 ">
                    {zona.nombre}
                  </p>
                </button>
              );
            })}
          </div>
        )}
      </section>

      <section className="w-full flex flex-col justify-center items-center ">
        <h2 className="text-2xl font-bold text-center text-zinc-900 mt-3 underline">
          Administradores de Zona
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "10px",
            width: "100%",
            padding: "10px",
          }}
        >
          {adminZona.map((zona, index) => {
            return (
              <>
                <article
                  key={index}
                  className="w-auto h-auto bg-white  flex flex-col justify-end shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] items-center hover:scale-105 transition-all duration-300 rounded-xl mt-3 "
                >
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/10061/10061684.png"
                    alt="admin"
                    className="rounded-t-xl w-10 h-10"
                  />
                  <p className="text-lg font-bold text-zinc-900 ">
                    {zona.nombre}
                  </p>
                  <small>Admin {zona.sector}</small>
                </article>
              </>
            );
          })}
        </div>
      </section>
      <ModalCarteraGeneral
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        zona={sector}
      />
    </>
  );
}
