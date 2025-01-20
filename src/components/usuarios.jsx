import { useEffect } from "react";
import { supabase } from "../hook/supabaseClient";
import UsuariosComponent from "./adminComponents/Proyectos/usuario";

export default function Usuarios() {
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
    <div className="flex flex-col items-center justify-center">
      <UsuariosComponent client:load />
    </div>
  );
}
