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
      <section class="w-full flex justify-center md:justify-end items-center text-white">
        <p class="text-center font-bold flex items-center text-xl text-black pr-4 gap-x-2">
          <img
            src="https://cdn-icons-png.flaticon.com/512/31/31368.png"
            alt=""
            class="w-6 h-6"
          />
          Cartera General
        </p>
      </section>

      <section>
        {loading && <p className="w-full text-center">Loading...</p>}
        {!loading && user && (
          <section className="grid grid-cols-1 md:grid-cols-3 gap-x-5 p-3 gap-y-2 md:gap-y-4 mx-auto ">
            {Filter.map((user) => (
              <button
                onClick={() => handleOpenModal(user.email)} // Pasar la función correctamente
                key={user.id}
                className="w-full max-w-xs mx-auto bg-white rounded-lg shadow-lg overflow-hidden hover:scale-105 transition duration-300 ease-in-out transform focus:outline-none"
              >
                {/* Header Background */}
                <div className="h-24 bg-black"></div>

                {/* Profile Content */}
                <div className="relative px-4 pb-6 -mt-12 text-center">
                  {/* Profile Image */}
                  <div className="inline-block relative">
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/4042/4042356.png"
                      alt="Profile"
                      className="w-24 h-24 rounded-full border-4 border-white object-cover"
                    />
                  </div>

                  {/* Profile Info */}
                  <h2 className="mt-2 text-xl font-semibold text-gray-800">
                    {user.nombre}
                  </h2>
                  <p className="text-gray-600 text-sm">{user.email}</p>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-4 justify-center">
                    <button className="px-6 py-2 bg-black text-white rounded-full hover:bg-blue-600 transition-colors">
                      {user.telefono}
                    </button>
                    <button className="px-6 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors">
                      {user.sector}
                    </button>
                  </div>

                  {/* Stats */}
                </div>
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
