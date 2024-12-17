import { supabase } from "./supabaseClient";
import { useEffect, useState } from "react";

const useMaximoValorDosCifras = () => {
  const [maximoValorDosCifras, setMaximoValorDosCifras] = useState(null);
  const [ids, setIds] = useState([]); // Estado para almacenar los IDs
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function fetchMaximoValor() {
    setLoading(true);

    // Seleccionamos tanto 'valor' como 'id' y ordenamos por valor descendente
    const { data, error } = await supabase
      .from("maximo_valor_dos_cifras")
      .select("id, valor")
      .order("valor", { ascending: false });

    setLoading(false);

    if (error) {
      console.error("Error fetching maximo_valor:", error);
      setError(error);
    } else if (data && data.length > 0) {
      // Asigna el valor máximo y extrae todos los IDs
      setMaximoValorDosCifras(data[0].valor);
      setIds(data.map((row) => row.id)); // Almacena todos los IDs
    } else {
      console.warn("No rows found in maximo_valor table.");
    }
  }

  useEffect(() => {
    fetchMaximoValor();
  }, []);

  return {
    maximoValorDosCifras,
    setMaximoValorDosCifras,
    ids, // Retorna los IDs también
    loading,
    error,
  };
};

export default useMaximoValorDosCifras;
