//import useSupabase from "../../hook/ApiSupabase";
import TableProyect from "./Table";
import { Toaster } from "sonner";
import { useState, useEffect } from "react";
export default function UsuariosAdminsZona() {
  const [sector, setSector] = useState(null);

  useEffect(() => {
    // Recuperar el valor de 'userSector' de localStorage cuando se carga el componente
    const storedSector = localStorage.getItem("userSector");
    if (storedSector) {
      setSector(storedSector);
    }
  }, []);

  return (
    <>
      <section className="w-full mx-auto flex flex-col justify-center items-center">
        <div className="flex flex-col ml-5 items-start">
          <h2 className="font-raleway-black text-4xl flex justify-start items-start mb-1">
            Editar usuarios {sector}
          </h2>
          <p className="w-[90%] md:w-[50%] flex justify-center items-center">
            En esta sección podrás editar los usuarios, Agregar mas o eliminar
            usuarios. Estos cambios se guardarán en la base de datos.
          </p>
        </div>
      </section>

      <TableProyect />
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerStyle={{
          background: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(10px)",
          zIndex: 10,
        }}
      />
    </>
  );
}
