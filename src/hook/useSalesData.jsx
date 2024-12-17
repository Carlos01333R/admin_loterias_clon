// hooks/useSalesData.js
import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
const useSalesData = (email) => {
  const [salesData, setSalesData] = useState({
    totalValorBruta: 0,
    totalVentaNeta: 0,
    totalGanancias: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSalesData = async () => {
      setLoading(true);
      const { data, error } = await supabase.rpc("sum_columns", {
        email_param: email,
      });

      if (error) {
        setError(error);
      } else {
        setSalesData(data[0]); // Acceder al primer objeto del array de resultados
      }
      setLoading(false);
    };

    if (email) {
      fetchSalesData();
    }
  }, [email]);

  return { salesData, loading, error };
};

export default useSalesData;
