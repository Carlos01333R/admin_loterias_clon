/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";
import { useState } from "react";
import IconGit from "../../../icons/IconGit";
import { supabase } from "../../../hook/supabaseClient";
import { toast } from "sonner";
import loteriasData from "../../../data/loterias.json";

export default function EditResultado({
  isOpen,
  onOpenChange,
  id,
  nombre,
  resultado,
  fecha,
}) {
  const [iduser, setIdUser] = useState(id);
  const [Nombre, setNombre] = useState(nombre);
  const [resultadoLoteria, setResultadoLoteria] = useState(resultado);
  const [fechaResultado, setFechaResultado] = useState(fecha);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      iduser.length === 0 ||
      Nombre.length === 0 ||
      resultadoLoteria.length === 0 ||
      fechaResultado.length === 0
    ) {
      toast.error("Complete all fields");
      return;
    }
    const { data, error } = await supabase
      .from("resultados_loteria")
      .update({
        id: iduser,
        lottery: Nombre,
        result: resultadoLoteria,
        date: fechaResultado,
      })
      .eq("id", id)
      .select();

    if (error) {
      console.error("Error updating data:", error.message);
      toast.error("Error updating data");
    } else {
      toast.success("Resultado actualizado correctamente");
      onOpenChange(false);
      window.location.reload();
    }
  };

  return (
    <Modal
      size="xl"
      style={{
        backgroundColor: "#13151a",
        color: "#fff",
      }}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="center"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Editar Resultado
            </ModalHeader>
            <ModalBody>
              <form className="text-white" onSubmit={handleSubmit}>
                <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <select
                    name="loteria"
                    className="text-black focus:border-primary rounded-xl text-sm "
                    value={Nombre}
                    onChange={(e) => setNombre(e.target.value)}
                  >
                    <option value="" disabled>
                      Seleccione una lotería
                    </option>
                    {Array.isArray(loteriasData.loterias) &&
                      loteriasData.loterias.map((loteria, index) => (
                        <option key={index} value={loteria.name}>
                          {loteria.name}
                        </option>
                      ))}
                  </select>

                  <Input
                    label="resultado"
                    name="resultado"
                    placeholder="Resultado de la lotería"
                    type="text"
                    value={resultadoLoteria}
                    onChange={(e) => setResultadoLoteria(e.target.value)}
                  />
                  <Input
                    label="fecha"
                    name="fecha"
                    placeholder="Fecha de la lotería"
                    type="date"
                    value={fechaResultado}
                    onChange={(e) => setFechaResultado(e.target.value)}
                  />
                </section>

                <div className="w-full flex justify-center items-center mt-3">
                  <Button
                    type="submit"
                    className="w-[90%] md:w-[50%] bg-white text-black flex items-center gap-2"
                    textValue="Editar Zonas"
                  >
                    Editar Resultado
                    <IconGit />
                  </Button>
                </div>
              </form>
            </ModalBody>

            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                Cerrar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
