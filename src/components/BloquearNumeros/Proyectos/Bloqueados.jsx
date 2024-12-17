//import useSupabase from "../../hook/ApiSupabase";
import TableBloqueo from "./TableBloqueo";
import MaximoValorComponent from "../../maximoValor/Proyectos/MaximoValor";
import MaximoValorTresCifrasComponent from "../../maximoValor/trescifras/Proyectos/MaximoValor";
import MaximoValorDosCifrasComponent from "../../maximoValor/doscifras/Proyectos/MaximoValor";

import { Toaster } from "sonner";
export default function NumerosBloqueadosComponent() {
  //const { countries, loading } = useSupabase();

  return (
    <>
      <section className="w-full mx-auto flex flex-col justify-center items-center">
        <div className="flex flex-col ml-5 items-start">
          <h2 className="font-raleway-black text-4xl flex justify-start items-start mb-1">
            Editar Numeros bloqueados
          </h2>
          <p className="w-[90%] md:w-[50%] flex justify-center items-center">
            En esta sección podrás editar los numeros bloqueader, Agregar mas o
            eliminar numeros con su respectiva loteria. Estos cambios se
            guardarán en la base de datos.
          </p>
        </div>
      </section>

      <TableBloqueo />

      <MaximoValorComponent />
      <MaximoValorTresCifrasComponent />
      <MaximoValorDosCifrasComponent />

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
