"use client";

import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
  Chip,
  Card,
  CardBody,
} from "@nextui-org/react";
import { toast } from "sonner";
import { Trash2, Plus } from "lucide-react";
import { supabase } from "../hook/supabaseClient";

const diasSemana = [
  "DOMINGO",
  "LUNES",
  "MARTES",
  "MIERCOLES",
  "JUEVES",
  "VIERNES",
  "SÁBADO",
];

export default function AgregarLoteriaModal({ isOpen, onClose, onSave }) {
  const [nombre, setNombre] = useState("");
  const [logo, setLogo] = useState("borra esto y pon la  url de la imagen");
  const [days, setDays] = useState([]);

  // Estado para el formulario de agregar nuevo día
  const [nuevoDia, setNuevoDia] = useState("");
  const [nuevaApertura, setNuevaApertura] = useState("00:00");
  const [nuevoCierre, setNuevoCierre] = useState("23:59");

  const resetForm = () => {
    setNombre("");
    setLogo("");
    setDays([]);
    setNuevoDia("");
    setNuevaApertura("00:00");
    setNuevoCierre("23:59");
  };

  const handleAgregarDia = () => {
    if (!nuevoDia) {
      toast.error("Por favor, selecciona un día");
      return;
    }

    // Verificar si el día ya existe
    const diaExistente = days.find((day) => day.dia === nuevoDia);
    if (diaExistente) {
      toast.error("Este día ya está agregado");
      return;
    }

    setDays([
      ...days,
      {
        dia: nuevoDia,
        apertura: nuevaApertura,
        cierre: nuevoCierre,
      },
    ]);

    // Resetear el formulario de día
    setNuevoDia("");
    setNuevaApertura("00:00");
    setNuevoCierre("23:59");
  };

  const handleEliminarDia = (index) => {
    const nuevosDias = [...days];
    nuevosDias.splice(index, 1);
    setDays(nuevosDias);
  };

  const handleSubmit = async () => {
    if (!nombre || days.length === 0) {
      toast.error(
        "Por favor, completa todos los campos y agrega al menos un día"
      );
      return;
    }

    const nuevaLoteria = {
      name: nombre,
      logo: logo,
      days: days,
    };

    try {
      const { data, error } = await supabase.from("loterias").select("*");

      if (error) throw error;

      const loteriasActualizadas = [...data[0].data.loterias, nuevaLoteria];

      const { error: updateError } = await supabase
        .from("loterias")
        .update({ data: { loterias: loteriasActualizadas } })
        .eq("id", data[0].id);

      if (updateError) throw updateError;

      toast.success("Lotería agregada con éxito");
      resetForm();
      onSave();
      onClose();
    } catch (error) {
      console.error("Error al agregar la lotería:", error);
      toast.error("Error al agregar la lotería");
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      scrollBehavior="inside"
      size="lg"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Agregar Nueva Lotería
        </ModalHeader>
        <ModalBody>
          <Input
            label="Nombre de la Lotería"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ingrese el nombre de la lotería"
          />
          <Input
            label="URL del Logo (si no sabe que poner, deja en blanco)"
            value={logo}
            onChange={(e) => setLogo(e.target.value)}
            placeholder="https://ejemplo.com/logo.png"
          />

          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">Días y Horarios</h3>

            {days.length > 0 ? (
              <div className="space-y-3 mb-4">
                {days.map((day, index) => (
                  <Card key={index} className="border border-gray-200">
                    <CardBody className="p-3">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <Chip color="primary" className="mb-2 sm:mb-0">
                          {day.dia}
                        </Chip>
                        <div className="flex flex-1 flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
                          <Input
                            type="time"
                            label="Apertura"
                            size="sm"
                            value={day.apertura}
                            readOnly
                            className="w-full sm:w-32"
                          />
                          <Input
                            type="time"
                            label="Cierre"
                            size="sm"
                            value={day.cierre}
                            readOnly
                            className="w-full sm:w-32"
                          />
                          <Button
                            isIconOnly
                            color="danger"
                            variant="light"
                            onPress={() => handleEliminarDia(index)}
                            className="mt-2 sm:mt-0"
                          >
                            <Trash2 size={18} />
                          </Button>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic mb-4">
                No hay días configurados
              </p>
            )}

            <div className="border-t pt-4">
              <h4 className="text-md font-medium mb-2">Agregar nuevo día</h4>
              <div className="flex flex-col sm:flex-row gap-2">
                <Select
                  label="Día"
                  placeholder="Selecciona un día"
                  selectedKeys={nuevoDia ? [nuevoDia] : []}
                  onSelectionChange={(keys) => setNuevoDia(Array.from(keys)[0])}
                  className="flex-1"
                >
                  {diasSemana.map((dia) => (
                    <SelectItem key={dia} value={dia}>
                      {dia}
                    </SelectItem>
                  ))}
                </Select>
                <Input
                  type="time"
                  label="Apertura"
                  value={nuevaApertura}
                  onChange={(e) => setNuevaApertura(e.target.value)}
                  className="flex-1"
                />
                <Input
                  type="time"
                  label="Cierre"
                  value={nuevoCierre}
                  onChange={(e) => setNuevoCierre(e.target.value)}
                  className="flex-1"
                />
                <Button
                  color="primary"
                  onPress={handleAgregarDia}
                  className="mt-6"
                  startContent={<Plus size={18} />}
                >
                  Agregar
                </Button>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={handleClose}>
            Cancelar
          </Button>
          <Button color="primary" onPress={handleSubmit}>
            Guardar Lotería
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
