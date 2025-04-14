"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "./supabaseClient";

export function useLoterias() {
  const [loterias, setLoterias] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLoterias = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.from("loterias").select("*");

      if (error) throw error;

      if (data && data.length > 0) {
        setLoterias(data[0].data.loterias);
      } else {
        setLoterias([]);
      }
    } catch (error) {
      console.error("Error al obtener las loterías:", error);
      setError(
        "Hubo un problema al cargar las loterías. Por favor, intenta de nuevo más tarde."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLoterias();
  }, [fetchLoterias]);

  return { loterias, isLoading, error, reloadLoterias: fetchLoterias };
}
