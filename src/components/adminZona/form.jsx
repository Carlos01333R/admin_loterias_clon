export default function FormAdminZona({ desde, hasta }) {
  const handleDesdeChange = (e) => {
    const [year, month, day] = e.target.value.split("-"); // Descomponer la fecha
    const selectedDate = new Date(year, month - 1, day); // Crear una fecha local
    console.log("Fecha Desde admin zona: ", selectedDate);
    desde(selectedDate);
  };

  const handleHastaChange = (e) => {
    const [year, month, day] = e.target.value.split("-");
    const selectedDate = new Date(year, month - 1, day);
    console.log("Fecha Hasta admin zona: ", selectedDate);
    hasta(selectedDate);
  };

  return (
    <>
      <section className="w-full flex justify-center items-center currentColor mb-3">
        <p className="text-center mb-2 mt-3 text-lg currentColor font-bold bg-white px-4 py-2 rounded-xl shadow-xl">
          Filtro por fechas
        </p>
      </section>

      <div className="w-full flex justify-center items-center gap-x-5">
        <form className="flex gap-x-10">
          <input
            type="date"
            name="desde"
            className="border-2 border-white px-4 py-2 rounded-xl text-black shadow-[0px_5px_17px_-1px_rgba(204,204,204,0.65)]"
            onChange={handleDesdeChange}
          />
          <input
            type="date"
            name="hasta"
            className="border-2 border-white px-4 py-2 rounded-xl text-black shadow-[0px_5px_17px_-1px_rgba(204,204,204,0.65)]"
            onChange={handleHastaChange}
          />
        </form>
      </div>
    </>
  );
}
