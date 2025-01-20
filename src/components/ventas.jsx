import { useEffect, useState } from "react";
import { supabase } from "../hook/supabaseClient";
import SalesIcon from "../icons/SalesIcon";
import FormAdmin from "./adminComponents/form";
import Ticket from "./adminComponents/ticket";
import useCarteraHoy from "../hook/carteraHoy";

export default function Venta() {
  const [desde, setDesde] = useState(null);
  const [hasta, setHasta] = useState(null);
  const { valorBrutaHoy, ventaNetaHoy, gananciasHoy } = useCarteraHoy();

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
  const formatColombianPesos = (amount) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

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

  const itemsHoy = [
    {
      name: "Venta Bruta",
      subName: "Venta Bruta general",
      value: formatColombianPesos(valorBrutaHoy),
      logo: "https://cdn-icons-png.flaticon.com/512/5305/5305244.png",
    },
    {
      name: "Ganancias",
      subName: "Ganancias general",
      value: formatColombianPesos(ventaNetaHoy),
      logo: "https://images.vexels.com/media/users/3/147974/isolated/preview/22ed2b8524101426e7b490c95097a8f2-icono-de-ventas-comerciales.png",
    },
    {
      name: "Ganancias Clientes",
      subName: "Ganancias Clientes general",
      value: formatColombianPesos(gananciasHoy),
      logo: "https://cdn-icons-png.freepik.com/512/10997/10997932.png",
    },
  ];

  return (
    <>
      <div className="w-full hidden md:block">
        <img className="w-full h-20" src="/Shapedividers.svg" alt="" />
      </div>

      <section className="w-full px-4 flex justify-center md:justify-end   text-orange-400 mt-5 md:mt-0">
        <p
          className="text-black flex gap-x-2 items-center
        px-4 py-2 text-2xl  font-extrabold bg-white rounded-xl shadow-xl "
        >
          <img className="h-8" src="/sale.png" alt="" />
          Ventas hoy
        </p>
      </section>

      <section className="w-full p-4 grid grid-cols-1 md:grid-cols-3 gap-x-5  gap-y-2 md:gap-y-0">
        {itemsHoy.map((item, index) => (
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

      <section className="w-full mb-5 mt-5">
        <FormAdmin desde={setDesde} hasta={setHasta} />
      </section>

      {desde !== null && hasta !== null ? (
        <>
          <section>
            <Ticket
              fechaInicio={formatDate(desde)}
              fechaFin={formatDate(hasta)}
            />
          </section>
        </>
      ) : (
        <h2 className="text-xl font-bold text-zinc-900 text-center mt-5s">
          Selecciona las fechas de venta
        </h2>
      )}
    </>
  );
}
