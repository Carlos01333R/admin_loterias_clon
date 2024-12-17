import { useDisclosure } from "@nextui-org/react";
import useUsers from "../hook/users";
import { useState, useEffect } from "react";
import ModalCartera from "./componentAdminZona/Proyectos/modalCartera";
import { Toaster } from "sonner";
import { supabase } from "../hook/supabaseClient";

export default function CarterasGeneralesComponent() {
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        // Redirige a la página de login si no hay sesión
        window.location.href = "/";
      }
    };

    checkSession();
  }, []);

  const { user, loading } = useUsers();
  const [email, setEmail] = useState("");
  const [sector, setSector] = useState(""); // Estado para guardar el sector

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleSelectEmail = (email) => {
    // Filtra el usuario por email y guarda el sector en el estado
    const usuario = user?.find((u) => u.email === email);
    if (usuario) {
      setSector(usuario.sector); // Guarda el sector en el estado
    }
  };

  const handleOpenModal = (userEmail) => {
    setEmail(userEmail); // Establecer el correo electrónico del usuario
    handleSelectEmail(userEmail); // Filtrar y establecer el sector correspondiente
    onOpen(); // Abrir el modal
  };

  return (
    <>
      <section>
        {loading && <p className="w-full text-center">Loading...</p>}
        {!loading && user && (
          <section className="grid grid-cols-1 md:grid-cols-3 gap-x-5 p-3 gap-y-2 md:gap-y-4 mx-auto ">
            {user.map((user) => (
              <button
                onClick={() => handleOpenModal(user.email)} // Pasar la función correctamente
                key={user.id}
                className="rounded-lg p-4 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] flex flex-col justify-center items-center hover:scale-105 transition-all duration-300 h-auto"
              >
                <p>{user.nombre}</p>
                <p>{user.email}</p>
                <p>{user.telefono}</p>
                <p>{user.sector}</p>
              </button>
            ))}
          </section>
        )}
      </section>

      <ModalCartera
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        email={email}
        sector={sector}
      />
      <Toaster />
    </>
  );
}
