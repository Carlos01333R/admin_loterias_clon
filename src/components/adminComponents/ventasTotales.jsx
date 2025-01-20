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

  const {
    adminZona,
    loading: loadingAdmin,
    error: errorAdmin,
  } = useAdminZona();

  const VentaBruta = data?.[0]?.total_valor_bruta ?? 0;
  const Ganancias = data?.[0]?.total_venta_neta ?? 0;
  const GananciasCliente = data?.[0]?.total_ganancias ?? 0;

  const formatPesoCop = (amount) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };
  const handleOpenModal = (zona) => {
    setSector(zona); // Establecer el correo electrónico del usuario
    onOpen(); // Abrir el modal
  };

  if (loading) {
    return <p>Cargando...</p>;
  }

  const items = [
    {
      name: "Venta Bruta",
      subName: "Venta Bruta general",
      value: formatPesoCop(VentaBruta),
      logo: "https://cdn-icons-png.flaticon.com/512/5305/5305244.png",
    },
    {
      name: "Venta Neta",
      subName: "Venta Neta general",
      value: formatPesoCop(Ganancias),
      logo: "https://images.vexels.com/media/users/3/147974/isolated/preview/22ed2b8524101426e7b490c95097a8f2-icono-de-ventas-comerciales.png",
    },
    {
      name: "Ganancias Clientes",
      subName: "Ganancias Clientes general",
      value: formatPesoCop(GananciasCliente),
      logo: "https://cdn-icons-png.freepik.com/512/10997/10997932.png",
    },
  ];

  return (
    <>
      {error && <p className="text-red-500">{error.message}</p>}
      <section className="w-full px-4 flex justify-center md:justify-end   text-orange-400 mt-5 md:mt-0">
        <p
          className="text-black flex gap-x-2 items-center
        px-4 py-2 text-2xl  font-extrabold bg-white rounded-xl shadow-xl "
        >
          <img className="h-8" src="/sale.png" alt="" />
          Ventas
        </p>
      </section>

      <section className="w-full p-4 grid grid-cols-1 md:grid-cols-3 gap-x-5  gap-y-2 md:gap-y-0">
        {items.map((item, index) => (
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

      <section className="mt-3 w-full p-4 flex flex-col justify-center items-center">
        <div className="w-full flex justify-center md:justify-end mb-5 ">
          <p className="text-2xl flex gap-x-2 font-bold  mt-3 text-black bg-white px-4 py-2 rounded-xl shadow-xl">
            <img
              src="https://cdn.icon-icons.com/icons2/919/PNG/512/piechart_icon-icons.com_71902.png"
              alt="sectores"
              className="h-8"
            />
            Sectores
          </p>
        </div>

        {errorZonas && <p className="text-red-500">{errorZonas.message}</p>}
        {loadingZonas ? (
          <p className="text-orange-400">Cargando...</p>
        ) : (
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {zonas.map((zona, index) => (
                <button
                  onClick={() => handleOpenModal(zona.nombre)}
                  key={index}
                  className={`
                bg-white  rounded-xl p-3 shadow-xl focus:outline-none
                ${index === 0 ? "md:col-span-1 md:row-span-2" : ""}
                transition duration-300 ease-in-out transform hover:scale-105
              `}
                >
                  <div className="relative w-full h-full">
                    <img
                      src="https://static.comunicae.com/photos/notas/1161993/Barcelona.jpg"
                      alt="zona"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <p
                      className="
                    absolute inset-0 flex justify-center items-center 
                    text-white font-bold bg-black bg-opacity-70
                    rounded-lg text-2xl
                  "
                    >
                      <p className="bg-white px-2 py-1 rounded-lg text-black">
                        {zona.nombre}
                      </p>
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="w-full flex flex-col justify-center items-center ">
        <section className="w-full px-4 flex justify-center md:justify-end   text-orange-400">
          <p
            className="text-black flex gap-x-2 items-center
        px-4 py-2 text-2xl  font-extrabold bg-white rounded-xl shadow-xl "
          >
            <img
              className="h-8"
              src="https://cdn-icons-png.flaticon.com/512/8443/8443122.png"
              alt=""
            />
            Administradores
          </p>
        </section>

        <div className="container mx-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {adminZona.map((zona, index) => (
              <article
                key={index}
                className={`
          bg-white rounded-lg shadow-md p-6 
          ${index === 0 ? "md:col-span-1 md:row-span-2" : ""}
          transition duration-300 ease-in-out transform hover:scale-105
        `}
              >
                <div className="relative w-full h-48">
                  <img
                    src="https://cms.usanmarcos.ac.cr/sites/default/files/2024-06/areas-de-trabajo-de-un-administrador-de-empresas.png"
                    alt="admin"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div
                    className="
              absolute inset-0 flex flex-col justify-center items-center 
              bg-black bg-opacity-70 text-white text-center p-3
            "
                  >
                    <p className="text-lg font-bold">{zona.nombre}</p>
                    <small className="text-sm">Admin {zona.sector}</small>
                  </div>
                </div>
              </article>
            ))}
          </div>
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
