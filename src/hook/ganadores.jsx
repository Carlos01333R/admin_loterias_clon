/* eslint-disable react-hooks/exhaustive-deps */
import { supabase } from "./supabaseClient";
import { useEffect, useState } from "react";

const useGanadores = () => {
  const [ganadores, setGanadores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function getCountries() {
    setLoading(true);
    const { data, error } = await supabase.from("win").select();
    if (error) setError(error);
    else {
      setLoading(false);
      setGanadores(data);
    }
  }

  useEffect(() => {
    getCountries();
  }, []);

  return {
    ganadores,
    setGanadores,
    loading,
    error,
  };
};

export default useGanadores;
