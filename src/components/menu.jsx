import Logout from "./Logout.jsx";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";

export function DropdownCartera({
  nombre,
  name1,
  name2,
  href1,
  href2,
  logo1,
  logo2,
}) {
  return (
    <Dropdown>
      <DropdownTrigger>
        <button className="w-full focus:outline-none  bg-white text-[#000000] flex justify-center items-center font-bold">
          {nombre}
        </button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions" className="w-full ">
        <DropdownItem key="new">
          <a
            href={href1}
            className="w-full flex flex-col items-center  bg-[#000000] text-white rounded-full px-4 py-2"
          >
            <div className="flex items-center gap-x-2">
              <img src={logo1} alt={name1} class="w-6 h-6" />
              <p>{name1}</p>
            </div>
          </a>
        </DropdownItem>
        <DropdownItem key="new">
          <a
            href={href2}
            className="w-full flex flex-col justify-center items-center bg-[#000000] text-white rounded-full px-4 py-2 text-center"
          >
            <div className="flex items-center gap-x-2">
              <img src={logo2} alt={name2} />
              <p> {name2}</p>
            </div>
          </a>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

export default function Menu() {
  const items = [
    {
      name: "Home",
      href: "/admin/dashboard",
      logo: "/home.svg",
    },
    {
      component: (
        <DropdownCartera
          nombre="administrador"
          name1="Ventas"
          name2="Cartera"
          href1="/admin/ventas"
          href2="/admin/carteraAdmin"
          logo1="/ventas.svg"
          logo2="/cartera.svg"
        />
      ),
      logo: "/arrow-badge-down.svg",
    },
    {
      component: (
        <DropdownCartera
          nombre="ganadores"
          name1="Ganadores hoy"
          name2="Historial Ganadores"
          href1="/admin/win"
          href2="/admin/ganadores"
          logo1="/win.svg"
          logo2="/win.svg"
        />
      ),
      logo: "/trofeo.svg",
    },
    {
      component: (
        <DropdownCartera
          nombre="zonas"
          name1="Zonas"
          name2="Admin Zonas"
          href1="/admin/zonas"
          href2="/admin/adminZona"
          logo1="/ubi.svg"
          logo2="/ubi.svg"
        />
      ),
      logo: "/pin.svg",
    },

    {
      name: "Bloquear Numeros",
      href: "/admin/bloquearNumeros",
      logo: "/block.svg",
    },
    {
      component: (
        <DropdownCartera
          nombre="usuarios"
          name1="Usuarios"
          name2="ventas Usuarios"
          href1="/admin/users"
          href2="/admin/vista"
          logo1="/user.svg"
          logo2="/user.svg"
        />
      ),
      logo: "/user.svg",
    },
    {
      component: (
        <DropdownCartera
          nombre="loterias"
          name1="Numeros mas vendidos"
          name2="loterias"
          href1="/admin/frecuenciaLot"
          href2="/admin/loterias"
          logo1="/block.svg"
          logo2="/block.svg"
        />
      ),
      logo: "/block.svg",
    },
  ];

  return (
    <>
      <Logout client:load />
      <div className="flex flex-col justify-start items-center ">
        <ul className="w-full list-none p-4 text-white flex flex-col gap-y-2 mt-10">
          {items.map((item) => (
            <li
              key={item.name}
              className="w-full bg-white text-[#000000] mb-2 rounded-xl py-2 flex justify-center items-center "
            >
              <div className="flex items-center text-[#000000] gap-x-2 font-bold">
                <img src={item.logo} alt={item.name} class="w-6 h-6" />
                {item.component || <a href={item.href}>{item.name}</a>}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
