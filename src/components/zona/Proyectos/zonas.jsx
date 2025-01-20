//import useSupabase from "../../hook/ApiSupabase";
import TableZona from "./Table";
import { Toaster } from "sonner";
export default function ZonasComponent() {
  //const { countries, loading } = useSupabase();

  return (
    <>
      <div className="w-full flex flex-col items-end ml-5 ">
        <p className="font-raleway-black mb-1 mr-10 text-2xl flex items-center  gap-x-2 font-extrabold">
          <img
            src="https://cdn.icon-icons.com/icons2/919/PNG/512/piechart_icon-icons.com_71902.png"
            alt="loteria"
            className="w-8 h-8"
          />
          Editar zonas
        </p>
        <p className="w-[30%] mr-4 text-sm">
          En esta sección podrás editar las zona, Agregar mas o eliminar y
          colocar porcentajes de ventas a cada sector. Estos cambios se
          guardarán en la base de datos.
        </p>
      </div>

      <TableZona />
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
