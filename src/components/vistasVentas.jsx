import { useState } from "react";
export default function VistasVentas({ ventas }) {
  const [search, setSearch] = useState("");

  const formatEuro = (amount) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  const FilterNumeroTicket = (ventas) => {
    if (ventas.length > 0) {
      return ventas.filter((venta) =>
        venta.numero_venta.toLowerCase().includes(search.toLowerCase())
      );
    } else {
      return ventas;
    }
  };

  const FilterTicket = FilterNumeroTicket(ventas);
  return (
    <>
      <section className="w-full flex justify-end items-center">
        <form className="mr-5 md:mr-10">
          <input
            type="text"
            placeholder="Buscar por ticket..."
            className="border-b-2 border-zinc-900 rounded-lg p-2 text-black"
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
      </section>

      <section className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-5 p-3 gap-y-2 md:gap-y-0">
        {ventas.length > 0 && FilterTicket.length > 0 ? (
          FilterTicket.map((venta, index) => (
            <div key={index}>
              <article className=" bg-white shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] flex flex-col justify-end items-center rounded-xl mt-3 ">
                <div className="w-full flex justify-between items-center p-2 rounded-lg">
                  <p className="bg-zinc-900 text-white rounded-lg px-1">
                    {venta.fecha} - {venta.hora}
                  </p>
                  <p className="text-green-600 font-bold ">
                    {" "}
                    #Venta {venta.numero_venta}
                  </p>
                </div>
                <div className="w-full flex justify-between items-center p-2 rounded-lg">
                  <article className="flex flex-col justify-center items-center">
                    <p className="font-bold text-lg">Tipo</p>
                    <p className="bg-green-500 p-1 px-1 rounded-lg text-white">
                      {venta.juego}
                    </p>
                  </article>
                  <article className="flex flex-col justify-center items-center">
                    <p className="font-bold text-lg">Venta</p>
                    <p> {formatEuro(venta.valor_bruta)}</p>
                  </article>
                  <article className="flex flex-col justify-center items-center">
                    <p className="font-bold text-lg">Cliente</p>
                    <div className="flex flex-col justify-center items-center">
                      <p>{venta.nombre} </p>
                      <p>{venta.celular}</p>
                    </div>
                  </article>
                </div>

                <div className="w-full flex justify-center items-center mt-1 mb-2">
                  <a
                    href={`https://admin-loterias.vercel.app/ticket?ref_venta=${venta.numero_venta}`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-zinc-900 text-white rounded-lg px-1 py-2 text-sm"
                  >
                    Descargar el ticket
                  </a>
                </div>
              </article>
            </div>
          ))
        ) : (
          <p>No hay ventas para este periodo</p>
        )}
      </section>
    </>
  );
}
