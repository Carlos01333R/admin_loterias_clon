import { useDisclosure } from "@nextui-org/react";
import useUsers from "../../../hook/users";
import { useState, useEffect } from "react";
import ModalCartera from "./modalCartera";
import { Toaster } from "sonner";

export default function CarterasComponent() {
  const [sector, setSector] = useState(null);
  const { user, loading } = useUsers();
  const [email, setEmail] = useState("");

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    // Recuperar el valor de 'userSector' de localStorage cuando se carga el componente
    const storedSector = localStorage.getItem("userSector");
    if (storedSector) {
      setSector(storedSector);
    }
  }, []);

  const filterZona = (user) => {
    if (!user) return []; // Asegúrate de que user no sea null
    if (sector === null) return user;
    return user.filter((user) =>
      user.sector.toLowerCase().includes(sector.toLowerCase())
    );
  };

  const Filter = filterZona(user); // Validación adicional para evitar errores

  const handleOpenModal = (userEmail) => {
    setEmail(userEmail); // Establecer el correo electrónico del usuario
    onOpen(); // Abrir el modal
  };

  return (
    <>
      <section>
        {loading && <p>Loading...</p>}
        {!loading && user && (
          <>
            <section className="grid grid-cols-1 md:grid-cols-3 gap-x-5 p-3 gap-y-2 md:gap-y-4 mx-auto ">
              {Filter.map((user) => (
                <button
                  onClick={() => handleOpenModal(user.email)} // Pasar la función correctamente
                  key={user.id}
                  className=" rounded-lg p-4 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] flex flex-col justify-center items-center hover:scale-105 transition-all duration-300 h-auto "
                >
                  <p>{user.nombre}</p>
                  <p>{user.email}</p>
                  <p>{user.telefono}</p>
                  <p>{user.sector}</p>
                </button>
              ))}
            </section>
          </>
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
