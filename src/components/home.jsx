import { useEffect } from "react";
import { supabase } from "../hook/supabaseClient";
import VentasTotales from "./adminComponents/ventasTotales";

export default function Home() {
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

  const handleLogout = async () => {
    await supabase.auth.signOut(); // Cierra la sesión
    window.location.href = "/"; // Redirige al login después de cerrar sesión
  };

  return (
    <section className="w-full flex flex-col justify-center items-center ">
      <VentasTotales />
    </section>
  );
}
