//import useSupabase from "../../hook/ApiSupabase";
import TableResultados from "./Table";
import { Toaster } from "sonner";
export default function ResultadosComponent() {
  //const { countries, loading } = useSupabase();

  return (
    <>
      <div className="w-full flex flex-col items-end ml-5 ">
        <p className="font-raleway-black mb-1 mr-10 text-2xl flex items-center  gap-x-2 font-extrabold">
          <img
            src="https://cdn-icons-png.flaticon.com/512/9913/9913579.png"
            alt="loteria"
            className="w-8 h-8"
          />
          Agregar Resultado de loterias
        </p>
        <p className="w-[30%] mr-8 text-sm">
          En esta sección podrás agregar resultados de loterías y ver los
          premios ganados por cada lotería. Estos cambios se guardarán en la
          base de datos.
        </p>
      </div>

      <TableResultados />
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
