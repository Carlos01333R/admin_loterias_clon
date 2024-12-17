/* eslint-disable react-hooks/exhaustive-deps */
import { supabase } from "./supabaseClient";
import { useEffect, useState } from "react";

const useZonasPorcentaje = ({ zona }) => {
  const [zonas, setZonas] = useState([]);
  const [loading, setLoading] = useState(false);

  async function getCountries() {
    setLoading(true);
    const { data, error } = await supabase
      .from("zonas")
      .select("porcentaje_admin_zona")
      .eq("nombre", zona);
    if (error) console.error(error);
    else {
      setLoading(false);
      setZonas(data);
    }
  }

  useEffect(() => {
    getCountries();
  }, [zona]);

  return {
    zonas,
    setZonas,
    loading,
  };
};

export default useZonasPorcentaje;
