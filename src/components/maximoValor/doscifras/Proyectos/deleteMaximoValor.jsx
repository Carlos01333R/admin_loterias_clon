/* eslint-disable react/prop-types */
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";

import { supabase } from "../../../../hook/supabaseClient";
import { toast } from "sonner";

export default function DeleteMaximoValor({ isOpen, onOpenChange, Name, id }) {
  const handleDelete = async () => {
    const { error } = await supabase
      .from("maximo_valor_dos_cifras")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting data:", error.message);
      toast.error("Error deleting data");
    } else {
      toast.success("limine Eliminado Correctamente");
      onOpenChange(false);
      window.location.reload();
    }
  };

  return (
    <>
      <Modal
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
                Delete {Name}
              </ModalHeader>
              <ModalBody>
                <h2 className="font-raleway-black 2xl text-center ">
                  ¿Estás seguro de que quieres eliminar a {Name}?
                </h2>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={handleDelete}>
                  Si
                </Button>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Cerrar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
