import { useState, useEffect } from "react";
export default function LogoutZona() {
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedEmail = localStorage.getItem("userEmail");
      setUserName(storedEmail);
    }
  }, []); // Se asegura de ejecutar esto solo una vez cuando el componente se monta

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    window.location.href = "/"; // Redirige al login después de cerrar sesión
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <p className="text-white text-lg font-bold">Bienvenido</p>
      <img
        src="https://cdn.dribbble.com/users/673318/screenshots/2859542/media/f504c0b9f32b5a76da5ca1992a17ebd6.jpg?resize=400x0"
        alt="Logo"
        className="w-10 h-10 rounded-full"
      />
      <p className="text-white text-xs">
        {userName ? userName : "Usuario no identificado"}
      </p>
      <button
        onClick={handleLogout}
        className="bg-white text-zinc-900 py-1 px-2 rounded-xl font-semibold hover:bg-zinc-900 hover:text-white hover:border-2 transition-all duration-300 mt-2"
      >
        Cerrar sesión
      </button>
    </div>
  );
}
