import { useEffect } from "react";
import { supabase } from "../hook/supabaseClient";
import AdminComponent from "./adminZona/Proyectos/AdminZona";
export default function Admin_zona() {
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
    <div className="flex flex-col items-center justify-center h-screen">
      <AdminComponent client:load />
    </div>
  );
}
