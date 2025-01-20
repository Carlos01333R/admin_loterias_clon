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

  const itemsHoy = [
    {
      name: "Venta Bruta",
      subName: "Venta Bruta general",
      value: formatColombianPesos(valorBrutaHoy),
      logo: "https://cdn-icons-png.flaticon.com/512/5305/5305244.png",
    },
    {
      name: "Venta Neta",
      subName: "Venta Neta general",
      value: formatColombianPesos(ventaNetaHoyNew),
      logo: "https://images.vexels.com/media/users/3/147974/isolated/preview/22ed2b8524101426e7b490c95097a8f2-icono-de-ventas-comerciales.png",
    },
    {
      name: "Ganancias Usuarios",
      subName: "Ganancias Usuarios general",
      value: formatColombianPesos(gananciasHoyNew),
      logo: "https://cdn-icons-png.freepik.com/512/10997/10997932.png",
    },
    {
      name: "Ganancias admin zona",
      subName: "Ganancias admin zona general",
      value: formatColombianPesos(gananciasAdminZonaNew),
      logo: "https://cdn-icons-png.flaticon.com/512/5305/5305244.png",
    },
  ];

  if (loading) {
    return <p>Loading...</p>; // Muestra un mensaje de carga mientras se verifica la sesión
  }

  if (!isLoggedIn) {
    return null; // Retorna null si el usuario no está logueado
  }

  return (
    <>
      <section className="w-full px-4 flex justify-center md:justify-end   text-orange-400 mt-5 md:mt-0">
        <p
          className="text-black flex gap-x-2 items-center
        px-4 py-2 text-2xl  font-extrabold bg-white rounded-xl shadow-xl "
        >
          <img className="h-8" src="/sale.png" alt="" />
          Ventas hoy
        </p>
      </section>
      <section className="w-full p-4 grid grid-cols-1 md:grid-cols-3 gap-x-5  gap-y-2 md:gap-y-2">
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
