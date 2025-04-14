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

export default function ModalEditarLoteria({ loteria, onClose, onSave }) {
  const [name, setName] = useState(loteria.name);
  const [logo, setLogo] = useState(loteria.logo);
  const [days, setDays] = useState(loteria.days || []);

  // Estado para el formulario de agregar nuevo día
  const [nuevoDia, setNuevoDia] = useState("");
  const [nuevaApertura, setNuevaApertura] = useState("00:00");
  const [nuevoCierre, setNuevoCierre] = useState("23:59");

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

    // Resetear el formulario
    setNuevoDia("");
    setNuevaApertura("00:00");
    setNuevoCierre("23:59");
  };

  const handleEliminarDia = (index) => {
    const nuevosDias = [...days];
    nuevosDias.splice(index, 1);
    setDays(nuevosDias);
  };

  const handleActualizarHorario = (index, campo, valor) => {
    const nuevosDias = [...days];
    nuevosDias[index][campo] = valor;
    setDays(nuevosDias);
  };

  async function guardar() {
    try {
      const { data, error } = await supabase.from("loterias").select("*");

      if (error) throw error;

      const loteriaActualizada = {
        ...loteria,
        name,
        logo,
        days: days,
      };

      const loteriasActualizadas = data[0].data.loterias.map((l) =>
        l.name === loteria.name ? loteriaActualizada : l
      );

      const { error: updateError } = await supabase
        .from("loterias")
        .update({ data: { loterias: loteriasActualizadas } })
        .eq("id", data[0].id);

      if (updateError) throw updateError;

      onSave();
    } catch (error) {
      console.error("Error al actualizar la lotería:", error);
      toast.error("Error al actualizar la lotería");
    }
  }

  return (
    <Modal isOpen={true} onClose={onClose} scrollBehavior="inside" size="lg">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Editar Lotería
        </ModalHeader>
        <ModalBody>
          <Input
            label="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            label="URL del Logo"
            value={logo}
            onChange={(e) => setLogo(e.target.value)}
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
                            onChange={(e) =>
                              handleActualizarHorario(
                                index,
                                "apertura",
                                e.target.value
                              )
                            }
                            className="w-full sm:w-32"
                          />
                          <Input
                            type="time"
                            label="Cierre"
                            size="sm"
                            value={day.cierre}
                            onChange={(e) =>
                              handleActualizarHorario(
                                index,
                                "cierre",
                                e.target.value
                              )
                            }
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
          <Button color="danger" variant="light" onPress={onClose}>
            Cancelar
          </Button>
          <Button color="primary" onPress={guardar}>
            Guardar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
