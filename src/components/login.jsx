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
      <section className="w-full  flex flex-col  justify-center items-center ">
        {/* Primer botón que abre el modal Admin */}
        <img className="w-full" src="/Shapedividers.svg" alt="" />
        <section className="flex flex-col justify-center items-center">
          <img
            src="/logoAppleSplats.png"
            alt="Logo"
            className="w-8 h-8 object-contain"
          />
          <h2 className="text-2xl font-bold text-black">Login ES</h2>
        </section>

        <div className="flex flex-col md:flex-row  w-full justify-center items-center gap-y-3 md:gap-x-5 mt-5 ">
          <button
            onClick={handleClickAdmin}
            className="w-[85%] md:w-[50vh]  rounded-xl hover:scale-105 transition-all duration-300 focus:outline-none"
          >
            <div className="flex flex-col border-t-1 border-l-1 border-r-1 rounded-xl rounded-b-none p-y-1 border-black justify-center items-center gap-x-2">
              <img
                src="https://as1.ftcdn.net/v2/jpg/05/90/59/88/1000_F_590598870_TOcGd4cUZzPoEMlxSc7XYwcupHOE0vLM.jpg"
                alt="Logo"
                className="w-28 h-28 rounded-full object-contain"
              />
              <span className="text-xl font-bold mt-1">Admin</span>
              <small className="text-xs text-black mb-2">
                Apartado solo para el Super Admin, Ingrese con su correo y
                contraseña
              </small>
            </div>
            <img className="w-full h-10" src="/Shapedividers.svg" alt="" />
          </button>

          {/* Segundo botón que abre el modal Admin Zona */}
          <button
            onClick={handleClickZona}
            className="w-[85%] md:w-[50vh]  rounded-xl hover:scale-105 transition-all duration-300  focus:outline-none"
          >
            <div className="flex flex-col border-t-1 border-l-1 border-r-1 rounded-xl rounded-b-none p-y-1 border-black justify-center items-center gap-x-2">
              <img
                src="https://cdn.dribbble.com/users/673318/screenshots/2859542/media/f504c0b9f32b5a76da5ca1992a17ebd6.jpg?resize=400x0"
                alt="Logo"
                className="w-28 h-28 rounded-full"
              />
              <span className="text-xl ">Admin Zona</span>
              <small className="text-xs text-black mb-2">
                Apartado solo para los Admin de Zona, Ingrese con su correo y
                contraseña
              </small>
            </div>

            <img className="w-full h-10" src="/Shapedividers.svg" alt="" />
          </button>
        </div>
        <section className="rotate-180 w-full md:bottom-0 md:absolute mt-10">
          <img className="w-full" src="/Shapedividers.svg" alt="" />
        </section>
      </section>

      {/* ModalAdmin que se controla con isOpenAdmin */}
      <ModalAdmin isOpen={isOpenAdmin} onOpenChange={onOpenChangeAdmin} />

      {/* ModalAdminZona que se controla con isOpenZona */}
      <ModalAdminZona isOpen={isOpenZona} onOpenChange={onOpenChangeZona} />
    </>
  );
}
