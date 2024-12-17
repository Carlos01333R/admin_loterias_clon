import { supabase } from "../../../../hook/supabaseClient";
import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";
import { toast } from "sonner";
import IconGit from "../../../../icons/IconGit";
export default function EditMaximoValor({ isOpen, onOpenChange, id, valor }) {
  const [valormaximo, setValorMaximo] = useState(valor);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!valormaximo) {
      toast.error("Complete all fields");
      return;
    }

    const { data, error } = await supabase
      .from("maximo_valor_dos_cifras")
      .update({
        valor: parseFloat(valormaximo), // Asegúrate de que sea numérico
      })
      .eq("id", id) // Solo usa el id que recibes por props
      .select();

    if (error) {
      console.error("Error updating data:", error.message);
      toast.error("Error updating data");
    } else {
      toast.success("Maximo Valor Editado Correctamente");
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
              Editar Valor Maximo
            </ModalHeader>
            <ModalBody>
              <form className="text-white" onSubmit={handleSubmit}>
                <section className="grid grid-cols-1 md:grid-cols-1 gap-3">
                  <Input
                    label="Valor Maximo"
                    name="valor"
                    placeholder="valor maximo"
                    type="text"
                    value={valormaximo}
                    onChange={(e) => setValorMaximo(e.target.value)}
                  />
                </section>

                <div className="w-full flex justify-center items-center mt-3">
                  <Button
                    type="submit"
                    className="w-[90%] md:w-[50%] bg-white text-black flex items-center gap-2"
                    textValue="Editar Zonas"
                  >
                    Editar Valor Maximo
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
