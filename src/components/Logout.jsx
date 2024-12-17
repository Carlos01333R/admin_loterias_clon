import { useState, useEffect } from "react";
import { supabase } from "../hook/supabaseClient";

export default function Logout() {
  const [userName, setUserName] = useState("");

  // Obtener el usuario actual
  useEffect(() => {
    const getUserInfo = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (session) {
        const user = session.user; // Obtener el usuario
        setUserName(user.email); // Establecer el nombre de usuario o el email
      } else if (error) {
        console.error("Error fetching session: ", error);
      }
    };

    getUserInfo();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut(); // Cierra la sesión
    window.location.href = "/"; // Redirige al login después de cerrar sesión
  };

  return (
    <div className="flex flex-col items-center justify-center ">
      <p className="text-white text-lg font-bold">Bienvenido</p>{" "}
      <img
        src="https://as1.ftcdn.net/v2/jpg/05/90/59/88/1000_F_590598870_TOcGd4cUZzPoEMlxSc7XYwcupHOE0vLM.jpg"
        alt="Logo"
        className="w-10 h-10 rounded-full"
      />
      <p className="text-white text-xs">{userName || "Usuario"}</p>{" "}
      {/* Muestra el nombre de usuario */}
      <button
        onClick={handleLogout}
        className="bg-white text-zinc-900 py-1 px-2 rounded-xl font-semibold hover:bg-zinc-900 hover:text-white hover:border-2 transition-all duration-300 mt-2"
      >
        Cerrar sesión
      </button>
    </div>
  );
}
