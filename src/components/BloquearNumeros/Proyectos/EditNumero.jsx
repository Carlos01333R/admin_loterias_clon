import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
} from "@nextui-org/react";
import IconGit from "../../../icons/IconGit";
import { supabase } from "../../../hook/supabaseClient";
import { toast } from "sonner";
export default function EditNumero({
  isOpen,
  onOpenChange,
  id,
  numero, // Prop
  valor,
}) {
  const [numeroState, setNumero] = useState(numero); // Cambié el nombre aquí
  const [valorState, setValor] = useState(valor); // Cambié el nombre aquí

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (numeroState.length === 0 || valorState.length === 0) {
      toast.error("Complete all fields");
      return;
    }
    const { data, error } = await supabase
      .from("bloquear_number")
      .update({
        numero: numeroState, // Usé numeroState aquí
        valor: valorState, // Usé valorState aquí
      })
      .eq("id", id)
      .select();

    if (error) {
      console.error("Error updating data:", error.message);
      toast.error("Error updating data");
    } else {
      toast.success("Usuario actualizado correctamente");
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
              Editar Numero a bloquear
            </ModalHeader>
            <ModalBody>
              <form className="text-white" onSubmit={handleSubmit}>
                <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    label="Numero bloqueado"
                    name="nombre"
                    placeholder="Numero a bloquear"
                    type="number"
                    value={numeroState} // Usé numeroState aquí
                    onChange={(e) => setNumero(e.target.value)}
                  />

                  <Input
                    label="Valor maximo"
                    name="valor"
                    placeholder="Valor maximo"
                    type="number"
                    value={valorState} // Usé valorState aquí
                    onChange={(e) => setValor(e.target.value)}
                  />
                </section>

                <div className="w-full flex justify-center items-center mt-3">
                  <Button
                    type="submit"
                    className="w-[90%] md:w-[50%] bg-white text-black flex items-center gap-2"
                    textValue="Editar Zonas"
                  >
                    Editar Numero
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
