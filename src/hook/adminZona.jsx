import { supabase } from "./supabaseClient";
import { useState, useEffect } from "react";

const useAdminZona = () => {
  const [adminZona, setAdminZona] = useState([]);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdminZona = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.from("admin_zona").select("*");
        if (error) throw error;
        setAdminZona(data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchAdminZona();
  }, []);

  return { adminZona, loading, error, setAdminZona };
};

export default useAdminZona;
