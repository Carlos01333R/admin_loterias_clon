/* eslint-disable react-hooks/exhaustive-deps */
import { supabase } from "./supabaseClient";
import { useEffect, useState } from "react";

const useZonas = () => {
  const [zonas, setZonas] = useState(null);
  const [loading, setLoading] = useState(false);

  async function getCountries() {
    setLoading(true);
    const { data, error } = await supabase.from("zonas").select();
    if (error) console.error(error);
    else {
      setLoading(false);
      setZonas(data);
    }
  }

  useEffect(() => {
    getCountries();
  }, []);

  return {
    zonas,
    setZonas,
    loading,
  };
};

export default useZonas;
