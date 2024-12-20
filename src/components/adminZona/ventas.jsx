import { useEffect, useState } from "react";
import { supabase } from "../../hook/supabaseClient";
import SalesIcon from "../../icons/SalesIcon";
import FormAdminZona from "./form";
import Ticket from "./ticket";
import useVentasHoyAdminZona from "../../hook/ventasHoyAdminZona";
import useZonas from "../../hook/useZona";

export default function Venta() {
  const [desde, setDesde] = useState(null);
  const [hasta, setHasta] = useState(null);
  const [sector, setSector] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Estado para el login
  const [loading, setLoading] = useState(true); // Estado para indicar carga
  const { zonas } = useZonas();

  useEffect(() => {
    // Recuperar el valor de 'userSector' de localStorage cuando se carga el componente
    const storedSector = localStorage.getItem("userSector");
    if (storedSector) {
      setSector(storedSector);
    }
  }, []);

  const { valorBrutaHoy, ventaNetaHoy, gananciasHoy, adminZona } =
    useVentasHoyAdminZona({
      sector,
    });

  const adminZonaVentaNeta = zonas
    ? zonas.find((z) => z.nombre === sector)?.porcentaje_loteria
    : null;

  const adminZonaGanancias = zonas
    ? zonas.find((z) => z.nombre === sector)?.porcentaje_cliente
    : null;

  const ventaNetaHoyNew = (valorBrutaHoy * adminZonaVentaNeta) / 100;
  const gananciasHoyNew = (valorBrutaHoy * adminZonaGanancias) / 100;
  const gananciasAdminZonaNew = (valorBrutaHoy * adminZona) / 100;

  const formatDate = (date) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(date).toLocaleDateString("es-ES", options); // 'es-ES' para formato en español
  };

  const formatColombianPesos = (amount) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  useEffect(() => {
    // Función para verificar la sesión
    const checkSession = async () => {
      const email = localStorage.getItem("userEmail"); // Cambia esto según cómo almacenes el email
      if (!email) {
        // Si no hay email en localStorage, redirige a la página principal
        window.location.href = "/";
        return;
      }

      // Consulta a la tabla para verificar si el email existe
      const { data, error } = await supabase
        .from("admin_zona") // Cambia 'admin_zona' por el nombre de tu tabla
        .select("*")
        .eq("email", email)
        .single();

      if (error || !data) {
        // Si hay un error o no se encuentra el usuario, redirige a la página principal
        window.location.href = "/";
      } else {
        // Si el usuario existe en la tabla, se considera que está logueado
        setIsLoggedIn(true);
      }

      setLoading(false); // Deja de cargar
    };

    checkSession();
  }, []);

  if (loading) {
    return <p>Loading...</p>; // Muestra un mensaje de carga mientras se verifica la sesión
  }

  if (!isLoggedIn) {
    return null; // Retorna null si el usuario no está logueado
  }

  return (
    <>
      <h2 className="text-2xl font-bold text-center text-zinc-900 mt-3 underline">
        Ventas hoy
      </h2>

      <section className="w-full grid grid-cols-1 md:grid-cols-3 gap-x-5 p-3 gap-y-2 md:gap-y-0 mx-auto ">
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
            <p className="text-lg font-bold text-zinc-900">Venta Neta</p>
          </div>
          <p className="font-bold text-zinc-900">
            {formatColombianPesos(ventaNetaHoyNew)}
          </p>
        </div>
        <div className="border-2 border-zinc-200 rounded-lg p-4 h-20 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] flex flex-col justify-center items-center hover:scale-105 transition-all duration-300">
          <div className="flex items-center ">
            <SalesIcon />
            <p className="text-lg font-bold text-zinc-900">
              Ganancias usuarios
            </p>
          </div>
          <p className="font-bold text-zinc-900">
            {formatColombianPesos(gananciasHoyNew)}
          </p>
        </div>
        <div className="border-2 border-zinc-200 rounded-lg p-4 h-20 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] flex flex-col justify-center items-center hover:scale-105 transition-all duration-300">
          <div className="flex items-center ">
            <SalesIcon />
            <p className="text-lg font-bold text-zinc-900">
              Ganancias admin zona
            </p>
          </div>
          <p className="font-bold text-zinc-900">
            {formatColombianPesos(gananciasAdminZonaNew)}
          </p>
        </div>
      </section>

      <section className="w-full mb-5">
        <FormAdminZona desde={setDesde} hasta={setHasta} />
      </section>

      {desde !== null && hasta !== null ? (
        <section>
          <Ticket
            fechaInicio={formatDate(desde)}
            fechaFin={formatDate(hasta)}
            sector={sector}
          />
        </section>
      ) : (
        <h2 className="text-xl font-bold text-zinc-900 text-center mt-5">
          Selecciona las fechas de venta
        </h2>
      )}
    </>
  );
}
