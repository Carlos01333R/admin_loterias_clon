import { useState } from "react";
import HamburgerIcon from "../icons/hamburgerIcon.jsx";
import CloseIcon from "../icons/closeIcon.jsx";
import Logout from "./Logout.jsx";
export default function Header() {
  const [showHeader, setShowHeader] = useState(false);
  return (
    <>
      <header className="w-full h-16 bg-zinc-900 flex justify-between items-center text-white">
        <div className="flex items-center gap-x-5 ml-5 md:ml-10">
          <a
            href="/admin/dashboard"
            className="text-white flex items-center gap-x-2"
          >
            <img src="/logoAppleSplats.png" alt="Logo" className="w-10 h-10" />
            <h2 className="font-bold">Admin Dashboard</h2>
          </a>
        </div>
        <section className="md:hidden mr-5">
          {showHeader ? (
            <button onClick={() => setShowHeader(!showHeader)}>
              {CloseIcon()}
            </button>
          ) : (
            <button onClick={() => setShowHeader(!showHeader)}>
              {HamburgerIcon()}
            </button>
          )}
        </section>
      </header>

      {showHeader && (
        <div className="w-full absolute h-screen flex justify-end items-end z-10 transition-all duration-300 ease-in-out">
          <section className="w-[60%] bg-zinc-900 h-screen transition-all duration-300 ease-in-out">
            <div class="w-full flex justify-center items-center mt-10">
              <img src="/logoAppleSplats.png" alt="Logo" class="w-10 h-10" />
            </div>
            <div class="flex flex-col justify-start items-center ">
              <h1 class="text-2xl font-bold text-white">Menu</h1>
              <ul class="list-none p-4 text-white flex flex-col gap-y-2 mt-10">
                <li class="mb-2 border-b-2 border-white hover:border-zinc-900 transition-all duration-300 flex justify-center items-center">
                  <a href="/admin/dashboard" class="text-white">
                    Home
                  </a>
                </li>
                <li class="mb-2 border-b-2 border-white hover:border-zinc-900 transition-all duration-300 flex justify-center items-center">
                  <a href="/admin/ventas" class="text-white">
                    Ventas
                  </a>
                </li>

                <li class="mb-2 border-b-2 border-white hover:border-zinc-900 transition-all duration-300 flex justify-center items-center">
                  <a href="/admin/carteraAdmin" class="text-white">
                    Cartera
                  </a>
                </li>

                <li class="mb-2 border-b-2 border-white hover:border-zinc-900 transition-all duration-300 flex justify-center items-center">
                  <a href="/admin/win" class="text-white">
                    Ganadores hoy
                  </a>
                </li>
                <li class="mb-2 border-b-2 border-white hover:border-zinc-900 transition-all duration-300 flex justify-center items-center">
                  <a href="/admin/ganadores" class="text-white">
                    Historial Ganadores
                  </a>
                </li>
                <li class="mb-2 border-b-2 border-white hover:border-zinc-900 transition-all duration-300 flex justify-center items-center">
                  <a href="/admin/zonas" class="text-white">
                    Zonas
                  </a>
                </li>

                <li class="mb-2 border-b-2 border-white hover:border-zinc-900 transition-all duration-300 flex justify-center items-center">
                  <a href="/admin/bloquearNumeros" class="text-white">
                    Bloquear Numeros
                  </a>
                </li>

                <li class="mb-2 border-b-2 border-white hover:border-zinc-900 transition-all duration-300 flex justify-center items-center">
                  <a href="/admin/users" class="text-white">
                    Usuarios
                  </a>
                </li>
                <li class="mb-2 border-b-2 border-white hover:border-zinc-900 transition-all duration-300 flex justify-center items-center">
                  <a href="/admin/adminZona" class="text-white">
                    Admin Zonas
                  </a>
                </li>
              </ul>
              <Logout client:load />
            </div>
          </section>
        </div>
      )}
    </>
  );
}
