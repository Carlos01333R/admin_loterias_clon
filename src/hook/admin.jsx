/* eslint-disable react-hooks/exhaustive-deps */
import { supabase } from "./supabaseClient";
import { useEffect, useState } from "react";

const useAdmin = ({ sector }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  console.log(sector);
  async function getCountries() {
    setLoading(true);
    const { data, error } = await supabase
      .from("usuarios")
      .select()
      .eq("sector", sector);

    if (error) console.error(error);
    else {
      setLoading(false);
      setUser(data);
    }
  }

  useEffect(() => {
    getCountries();
  }, [sector]);

  return {
    user,
    setUser,
    loading,
  };
};

export default useAdmin;
