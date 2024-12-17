import { useEffect, useState } from "react";
import { supabase } from "../../hook/supabaseClient"; // Asegúrate de que la ruta sea
import Venta from "./ventas";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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

  const handleLogout = () => {
    // Eliminar el email del localStorage
    localStorage.removeItem("userEmail");
    // Redirigir a la página principal
    window.location.href = "/";
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      {isLoggedIn ? (
        <>
          <Venta />
        </>
      ) : (
        <p>Redirigiendo...</p>
      )}
    </div>
  );
}
