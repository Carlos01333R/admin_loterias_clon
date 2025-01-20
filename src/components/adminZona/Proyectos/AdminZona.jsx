//import useSupabase from "../../hook/ApiSupabase";
import TableadminZona from "./Table";
import { Toaster } from "sonner";
export default function AdminComponent() {
  //const { countries, loading } = useSupabase();

  return (
    <>
      <div className="w-full flex flex-col items-end ml-5 mt-5">
        <p className="font-raleway-black mb-1 mr-10 text-2xl flex items-center  gap-x-2 font-extrabold">
          <img
            src="https://cdn.icon-icons.com/icons2/919/PNG/512/piechart_icon-icons.com_71902.png"
            alt="loteria"
            className="w-8 h-8"
          />
          Editar Admin de zona
        </p>
        <p className="w-[30%] mr-8 text-sm">
          En esta sección podrás editar los Admin de zona, Agregar mas o
          eliminar admin. Estos cambios se guardarán en la base de datos.
        </p>
      </div>
      <TableadminZona />
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
