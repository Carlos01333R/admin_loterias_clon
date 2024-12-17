/* eslint-disable react-hooks/exhaustive-deps */
import { supabase } from "./supabaseClient";
import { useEffect, useState } from "react";

const useUsers = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  async function getCountries() {
    setLoading(true);
    const { data, error } = await supabase.from("usuarios").select();
    if (error) console.error(error);
    else {
      setLoading(false);
      setUser(data);
    }
  }

  useEffect(() => {
    getCountries();
  }, []);

  return {
    user,
    setUser,
    loading,
  };
};

export default useUsers;
