//import useSupabase from "../../hook/ApiSupabase";
import TableValorMaximo from "./Table";
import { Toaster } from "sonner";
export default function MaximoValorComponent() {
  //const { countries, loading } = useSupabase();

  return (
    <>
      <section className="w-full mx-auto flex flex-col ">
        <div className="flex flex-col ml-5 items-start">
          <h2 className="font-raleway-black text-4xl flex justify-start items-start mb-1">
            Editar maximo valor de 4 cifras
          </h2>
          <p className="w-[90%] md:w-[50%] flex ">
            En esta sección podrás editar el valor maximo.
          </p>
        </div>
      </section>

      <TableValorMaximo />
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
