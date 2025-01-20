import LogoutAdminZona from "./adminZona/logout.jsx";
export default function Menu() {
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

  return (
    <>
      <LogoutAdminZona />
      <div className="flex flex-col justify-start items-center ">
        <ul className="w-full list-none p-4 text-white flex flex-col gap-y-2 mt-10">
          {items.map((item) => (
            <li
              key={item.name}
              className="w-full bg-white text-[#000000] mb-2 rounded-xl py-2 flex justify-center items-center "
            >
              <div className="flex items-center text-[#000000] gap-x-2 font-bold">
                <img src={item.logo} alt={item.name} class="w-6 h-6" />
                <a href={item.href}>{item.name}</a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
