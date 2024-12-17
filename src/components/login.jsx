import UserIcon from "../icons/UserIcon.jsx";
import { useDisclosure, Button } from "@nextui-org/react";
import ModalAdmin from "./modalAdmin.jsx";
import ModalAdminZona from "./modalAdminZona.jsx";

export default function Login() {
  const {
    isOpen: isOpenAdmin,
    onOpen: onOpenAdmin,
    onOpenChange: onOpenChangeAdmin,
  } = useDisclosure();
  const {
    isOpen: isOpenZona,
    onOpen: onOpenZona,
    onOpenChange: onOpenChangeZona,
  } = useDisclosure();

  const handleClickAdmin = () => {
    onOpenAdmin(); // Abre el modal de Admin
  };

  const handleClickZona = () => {
    onOpenZona(); // Abre el modal de Admin Zona
  };

  return (
    <>
      <section className="w-full flex flex-col  justify-center items-center ">
        {/* Primer botón que abre el modal Admin */}
        <img
          src="/logoAppleSplats.png"
          alt="Logo"
          className="w-28 h-28 object-contain"
        />

        <div className="mb-5">
          <h1 className="text-2xl font-bold text-white">Login Admin</h1>
        </div>

        <div className="flex flex-col md:flex-row  w-full justify-center items-center gap-y-3 md:gap-x-5 mt-5 ">
          <button
            onClick={handleClickAdmin}
            className="w-[85%] md:w-[50vh] p-6 border-2 border-white rounded-lg hover:scale-105 transition-all duration-300"
          >
            <div className="flex flex-col justify-center items-center gap-x-2">
              <img
                src="https://as1.ftcdn.net/v2/jpg/05/90/59/88/1000_F_590598870_TOcGd4cUZzPoEMlxSc7XYwcupHOE0vLM.jpg"
                alt="Logo"
                className="w-28 h-28 rounded-full object-contain"
              />
              <span className="text-xl font-bold mt-1">Admin</span>
              <small className="text-xs text-gray-500">
                Apartado solo para el Super Admin, Ingrese con su correo y
                contraseña
              </small>
            </div>
          </button>

          {/* Segundo botón que abre el modal Admin Zona */}
          <button
            onClick={handleClickZona}
            className="w-[85%] md:w-[50vh] p-6 border-2 border-white rounded-lg hover:scale-105 transition-all duration-300"
          >
            <div className="flex flex-col justify-center items-center gap-x-2">
              <img
                src="https://cdn.dribbble.com/users/673318/screenshots/2859542/media/f504c0b9f32b5a76da5ca1992a17ebd6.jpg?resize=400x0"
                alt="Logo"
                className="w-28 h-28 rounded-full"
              />
              <span className="text-xl mt-1">Admin Zona</span>
              <small className="text-xs text-gray-500">
                Apartado solo para los Admin de Zona, Ingrese con su correo y
                contraseña
              </small>
            </div>
          </button>
        </div>
      </section>

      {/* ModalAdmin que se controla con isOpenAdmin */}
      <ModalAdmin isOpen={isOpenAdmin} onOpenChange={onOpenChangeAdmin} />

      {/* ModalAdminZona que se controla con isOpenZona */}
      <ModalAdminZona isOpen={isOpenZona} onOpenChange={onOpenChangeZona} />
    </>
  );
}
