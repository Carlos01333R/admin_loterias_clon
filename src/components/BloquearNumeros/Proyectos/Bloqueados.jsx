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
      <div className="w-full flex flex-col items-end ml-5 ">
        <p className="font-raleway-black mb-3 mr-10 text-2xl flex items-center  gap-x-2 font-extrabold ">
          <img
            src="https://images.vexels.com/media/users/3/131263/isolated/lists/af6816ec67ec51da6b275a4aa08d236c-icono-de-circulo-de-bloqueo.png"
            alt="loteria"
            className="w-8 h-8"
          />
          Editar Numeros bloqueados
        </p>
        <p className="w-[30%] mr-8 text-sm">
          En esta sección podrás editar los numeros bloqueader, Agregar mas o
          eliminar numeros con su respectiva loteria. Estos cambios se guardarán
          en la base de datos.
        </p>
      </div>

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
