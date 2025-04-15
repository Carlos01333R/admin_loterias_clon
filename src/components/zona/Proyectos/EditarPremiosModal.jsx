import React, { useState, useEffect } from "react";
import {
  Modal,
  Input,
  Button,
  Spinner,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Divider,
} from "@nextui-org/react";
import { supabase } from "../../../hook/supabaseClient";

const EditarPremiosModal = ({ isOpen, onOpenChange, id, zona }) => {
  const [premios, setPremios] = useState({
    "2cifras": 0,
    "3cifras": 0,
    "3combi": 0,
    "4cifras": 0,
    "4combi": 0,
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && id) {
      cargarPremios();
    }
  }, [isOpen, id]);

  const cargarPremios = async () => {
    try {
      setLoading(true);
      setError(null);

      // Convertir id a número para asegurar consistencia
      const idNumero = Number(id);

      const { data, error: supabaseError } = await supabase
        .from("zonas")
        .select("2cifras, 3cifras, 3combi, 4cifras, 4combi")
        .eq("id", idNumero)
        .maybeSingle(); // Cambiado a maybeSingle para manejar casos null

      if (supabaseError) throw supabaseError;

      if (!data) {
        throw new Error(`No se encontró la zona con ID: ${idNumero}`);
      }

      setPremios({
        "2cifras": data["2cifras"] || 0,
        "3cifras": data["3cifras"] || 0,
        "3combi": data["3combi"] || 0,
        "4cifras": data["4cifras"] || 0,
        "4combi": data["4combi"] || 0,
      });
    } catch (err) {
      console.error("Error al cargar premios:", err);
      setError(err.message);
      setPremios({
        // Resetear valores si hay error
        "2cifras": 0,
        "3cifras": 0,
        "3combi": 0,
        "4cifras": 0,
        "4combi": 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key, value) => {
    const numValue = Math.abs(parseInt(value) || 0);
    setPremios((prev) => ({
      ...prev,
      [key]: numValue,
    }));
  };

  const guardarCambios = async () => {
    try {
      setSaving(true);
      setError(null);

      const idNumero = Number(id);

      const { error: supabaseError } = await supabase
        .from("zonas")
        .update(premios)
        .eq("id", idNumero);

      if (supabaseError) throw supabaseError;

      onOpenChange(false);
    } catch (err) {
      console.error("Error al guardar:", err);
      setError(`Error al guardar: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="lg"
      backdrop="blur"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Editar Premios
            </ModalHeader>
            <Divider />
            <ModalBody>
              {error && (
                <div className="text-red-500 p-2 mb-4 rounded bg-red-50">
                  {error}
                </div>
              )}

              {loading ? (
                <div className="flex justify-center py-8">
                  <Spinner size="lg" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
                  <Input
                    label="Premio 2 Cifras"
                    labelPlacement="outside"
                    value={premios["2cifras"].toString()}
                    onChange={(e) => handleChange("2cifras", e.target.value)}
                    type="number"
                    min="0"
                    startContent={<span className="text-default-400">$</span>}
                  />

                  <Input
                    label="Premio 3 Cifras"
                    labelPlacement="outside"
                    value={premios["3cifras"].toString()}
                    onChange={(e) => handleChange("3cifras", e.target.value)}
                    type="number"
                    min="0"
                    startContent={<span className="text-default-400">$</span>}
                  />

                  <Input
                    label="Premio 3 Combi"
                    labelPlacement="outside"
                    value={premios["3combi"].toString()}
                    onChange={(e) => handleChange("3combi", e.target.value)}
                    type="number"
                    min="0"
                    startContent={<span className="text-default-400">$</span>}
                  />

                  <Input
                    label="Premio 4 Cifras"
                    labelPlacement="outside"
                    value={premios["4cifras"].toString()}
                    onChange={(e) => handleChange("4cifras", e.target.value)}
                    type="number"
                    min="0"
                    startContent={<span className="text-default-400">$</span>}
                  />

                  <Input
                    label="Premio 4 Combi"
                    labelPlacement="outside"
                    value={premios["4combi"].toString()}
                    onChange={(e) => handleChange("4combi", e.target.value)}
                    type="number"
                    min="0"
                    startContent={<span className="text-default-400">$</span>}
                  />
                </div>
              )}
            </ModalBody>
            <Divider />
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancelar
              </Button>
              <Button
                color="primary"
                onPress={guardarCambios}
                isLoading={saving}
                isDisabled={!!error || loading}
              >
                {saving ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default EditarPremiosModal;
