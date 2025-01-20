import { useState, useEffect } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";

function DropdownComponent({ name, handleLogout }) {
  return (
    <Dropdown>
      <DropdownTrigger>
        <button className="h-8 w-8 rounded-full bg-white text-[#0064FF] flex justify-center items-center  focus:outline-none">
          <img src="/arrow-badge-down.svg" alt="" />
        </button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        <DropdownItem key="new">
          <p className="font-bold text-sm truncate text-[#F5BE40] text-center">
            {name}
          </p>
        </DropdownItem>
        <DropdownItem key="new">
          <button
            onClick={handleLogout}
            className="bg-white  w-full text-black rounded-full px-4 py-2"
          >
            Cerrar sesión
          </button>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

export default function LogoutAdminZona() {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedEmail = localStorage.getItem("userEmail");
      setUserName(storedEmail);
    }
  }, []); // Se asegura de ejecutar esto solo una vez cuando el componente se monta

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    window.location.href = "/"; // Redirige al login después de cerrar sesión
  };

  return (
    <div className="w-full flex flex-col items-center justify-center ">
      <section className="flex flex-col items-center justify-center py-2 gap-y-2 mt-10">
        <img
          src="https://as1.ftcdn.net/v2/jpg/05/90/59/88/1000_F_590598870_TOcGd4cUZzPoEMlxSc7XYwcupHOE0vLM.jpg"
          alt="Logo"
          className="w-14 h-14 rounded-full"
        />
        <p className="text-white">Admin general</p>
        <DropdownComponent name={userName} handleLogout={handleLogout} />
      </section>
    </div>
  );
}
