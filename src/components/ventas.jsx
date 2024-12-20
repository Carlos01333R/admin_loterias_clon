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

  return (
    <>
      <h2 className="text-2xl font-bold text-center text-zinc-900 mt-3 underline">
        Ventas hoy
      </h2>
      <section className="w-full grid grid-cols-1 md:grid-cols-3 gap-x-5 p-3 gap-y-2 md:gap-y-0">
        <div className="border-2 border-zinc-200 rounded-lg p-4  h-20 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] flex flex-col justify-center items-center hover:scale-105 transition-all duration-300">
          <div className="flex items-center ">
            <SalesIcon />
            <p className="text-lg font-bold text-zinc-900">Venta Bruta</p>
          </div>
          <p className="font-bold text-zinc-900">
            {formatColombianPesos(valorBrutaHoy)}
          </p>
        </div>
        <div className="border-2 border-zinc-200 rounded-lg p-4 h-20 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] flex flex-col justify-center items-center hover:scale-105 transition-all duration-300">
          <div className="flex items-center ">
            <SalesIcon />
            <p className="text-lg font-bold text-zinc-900">Ganancias</p>
          </div>
          <p className="font-bold text-zinc-900">
            {formatColombianPesos(ventaNetaHoy)}
          </p>
        </div>
        <div className="border-2 border-zinc-200 rounded-lg p-4 h-20 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] flex flex-col justify-center items-center hover:scale-105 transition-all duration-300">
          <div className="flex items-center ">
            <SalesIcon />
            <p className="text-lg font-bold text-zinc-900">
              Ganancias Clientes
            </p>
          </div>
          <p className="font-bold text-zinc-900">
            {formatColombianPesos(gananciasHoy)}
          </p>
        </div>
      </section>

      <section className="w-full mb-5">
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
