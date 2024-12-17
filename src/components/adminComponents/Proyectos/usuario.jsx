//import useSupabase from "../../hook/ApiSupabase";
import TableProyect from "./Table";
import { Toaster } from "sonner";
export default function UsuariosComponent() {
  //const { countries, loading } = useSupabase();

  return (
    <>
      <section className="w-full mx-auto flex flex-col justify-center items-center mt-10">
        <div className="flex flex-col ml-5 items-start">
          <h2 className="font-raleway-black text-4xl flex justify-start items-start mb-1">
            Editar usuarios
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
