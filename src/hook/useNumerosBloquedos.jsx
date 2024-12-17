import { supabase } from "./supabaseClient";
import { useEffect, useState } from "react";

const useNumerosBloqueados = () => {
  const [numerosBloqueados, setNumerosBloqueados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function getCountries() {
    setLoading(true);
    const { data, error } = await supabase.from("bloquear_number").select();

    if (error) {
      setError(error);
      console.error("Error fetching data:", error.message);
    } else {
      setLoading(false);
      setNumerosBloqueados(data);
    }
  }

  useEffect(() => {
    getCountries();
  }, []);

  return {
    numerosBloqueados,
    setNumerosBloqueados,
    loading,
    error,
  };
};

export default useNumerosBloqueados;
