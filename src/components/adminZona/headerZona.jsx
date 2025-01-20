import { useState } from "react";
import HamburgerIcon from "../../icons/hamburgerIcon.jsx";
import CloseIcon from "../../icons/closeIcon.jsx";
import LogoutAdminZona from "./logout.jsx";

export default function HeaderAdminZona() {
  const items = [
    {
      name: "Home",
      href: "/adminZona/dashboard",
      logo: "/home.svg",
    },
    {
      name: "zonas",
      href: "/adminZona/zonas",
      logo: "/pin.svg",
    },
    {
      name: "cartera",
      href: "/adminZona/carteras",
      logo: "/cartera.svg",
    },

    {
      name: "Usuarios",
      href: "/adminZona/users",
      logo: "/user.svg",
    },
  ];

  const [showHeader, setShowHeader] = useState(false);
  return (
    <>
      <header className="w-full flex  justify-end  items-center ">
        <section className="md:hidden p-0 w-[60%] flex justify-end  text-black items-center transition-all duration-300 ease-in-out rounded-l-xl bg-white">
          {showHeader ? (
            <div className=" flex flex-col items-center">
              <button
                className="px-2 py-1 mt-2 mr-2 bg-white text-black rounded-full"
                onClick={() => setShowHeader(!showHeader)}
              >
                {CloseIcon()}
              </button>
            </div>
          ) : (
            <butto
              className="px-4 py-4"
              onClick={() => setShowHeader(!showHeader)}
            >
              {HamburgerIcon()}
            </butto>
          )}
        </section>
      </header>

      {showHeader && (
        <>
          <div className="w-full absolute h-screen flex justify-end items-end z-10 transition-all duration-300 ease-in-out">
            <section className="w-[60%] bg-black h-screen transition-all duration-300 ease-in-out rounded-l-xl">
              <LogoutAdminZona client:load />
              <div class="w-full flex flex-col justify-start items-center ">
                <ul class="w-full list-none p-4 text-white flex flex-col gap-y-2 ">
                  {items.map((item) => (
                    <li
                      key={item.name}
                      class="w-full bg-white text-[#0064FF] mb-2 rounded-xl py-2 flex justify-center items-center hover:bg-slate-100"
                    >
                      <div className="flex items-center text-black gap-x-2">
                        <img src={item.logo} alt={item.name} class="w-6 h-6" />
                        {item.component || <a href={item.href}>{item.name}</a>}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </div>
        </>
      )}
    </>
  );
}
