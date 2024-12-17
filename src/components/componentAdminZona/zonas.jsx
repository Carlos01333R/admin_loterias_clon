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
      <section>
        {loading && <p>Loading...</p>}
        {!loading && zonas && (
          <>
            <section className="grid grid-cols-1 md:grid-cols-3 gap-x-5 p-3 gap-y-2 md:gap-y-4 mx-auto ">
              {FilterZona.map((zona, index) => {
                return (
                  <button
                    onClick={() => handleOpenModal(zona.nombre)}
                    key={index}
                    className=" rounded-lg p-4 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] flex flex-col justify-center items-center hover:scale-105 transition-all duration-300 h-auto "
                  >
                    <img
                      src="https://trayectoriasenviaje.com/wp-content/uploads/2022/05/que-hacer-cartagena-entrada_ciudad_amurallada.jpg"
                      alt="zona"
                      className="rounded-t-xl"
                    />
                    <p>{zona.nombre}</p>
                  </button>
                );
              })}
            </section>
          </>
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
