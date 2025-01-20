import { useEffect, useState } from "react";
import useZonas from "../../hook/useZona";
import { useDisclosure } from "@nextui-org/react";
import ModalCarteraGeneral from "../adminComponents/modalCarteraGeneral";

export default function ZonasComponent() {
  const [sector, setSector] = useState(null);
  const { zonas, loading } = useZonas();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    // Recuperar el valor de 'userSector' de localStorage cuando se carga el componente
    const storedSector = localStorage.getItem("userSector");
    if (storedSector) {
      setSector(storedSector);
    }
  }, []);

  const FilterZo = (zonas) => {
    if (!zonas) return []; // Asegúrate de que zonas no sea null
    return zonas.filter((zona) => zona.nombre.toLowerCase().includes(sector));
  };

  const FilterZona = FilterZo(zonas);

  const handleOpenModal = (zona) => {
    setSector(zona); // Establecer el correo electrónico del usuario
    onOpen(); // Abrir el modal
  };

  return (
    <>
      <div className="w-full flex justify-center md:justify-end mb-5 px-4">
        <p className="text-2xl flex gap-x-2 font-bold  mt-3 text-black bg-white px-4 py-2 rounded-xl shadow-xl">
          <img
            src="https://cdn.icon-icons.com/icons2/919/PNG/512/piechart_icon-icons.com_71902.png"
            alt="sectores"
            className="h-8"
          />
          Sectores
        </p>
      </div>

      <section>
        {loading ? (
          <p className="text-orange-400">Cargando...</p>
        ) : (
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {FilterZona.map((zona, index) => (
                <button
                  onClick={() => handleOpenModal(zona.nombre)}
                  key={index}
                  className={`
                bg-white  rounded-xl p-3 shadow-xl focus:outline-none
                ${index === 0 ? "md:col-span-1 md:row-span-2" : ""}
                transition duration-300 ease-in-out transform hover:scale-105
              `}
                >
                  <div className="relative w-full h-full">
                    <img
                      src="https://static.comunicae.com/photos/notas/1161993/Barcelona.jpg"
                      alt="zona"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <p
                      className="
                    absolute inset-0 flex justify-center items-center 
                    text-white font-bold bg-black bg-opacity-70
                    rounded-lg text-2xl
                  "
                    >
                      <p className="bg-white px-2 py-1 rounded-lg text-black">
                        {zona.nombre}
                      </p>
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      <ModalCarteraGeneral
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        zona={sector}
      />
    </>
  );
}
