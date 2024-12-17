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
      <h2 className="text-center mb-2 mt-3 text-lg text-zinc-900 font-bold">
        Filtro por fechas
      </h2>
      <div className="w-full flex justify-center items-center gap-x-5">
        <form className="flex gap-x-10">
          <input
            type="date"
            name="desde"
            className="border-b-2 border-zinc-900"
            onChange={handleDesdeChange}
          />
          <input
            type="date"
            name="hasta"
            className="border-b-2 border-zinc-900"
            onChange={handleHastaChange}
          />
        </form>
      </div>
    </>
  );
}
