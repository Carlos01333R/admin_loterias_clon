//import useSupabase from "../../hook/ApiSupabase";
import TableValorMaximo from "./Table";
import { Toaster } from "sonner";
export default function MaximoValorDosCifrasComponent() {
  //const { countries, loading } = useSupabase();

  return (
    <>
      <div className="w-full flex flex-col items-start ml-5">
        <p className="font-raleway-black mb-1 mr-10 text-2xl flex items-center  gap-x-2 font-extrabold ">
          <img
            src="https://images.vexels.com/media/users/3/131263/isolated/lists/af6816ec67ec51da6b275a4aa08d236c-icono-de-circulo-de-bloqueo.png"
            alt="loteria"
            className="w-8 h-8"
          />
          Editar maximo valor de 2 cifras
        </p>
        <p className="w-[30%] mr-8 text-sm mb-5">
          En esta sección podrás editar el valor maximo.
        </p>
      </div>

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
