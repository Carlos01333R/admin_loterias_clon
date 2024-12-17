import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  Textarea,
} from "@nextui-org/react";
import { toast } from "sonner";
import IconGit from "../../../icons/IconGit";
import { supabase } from "../../../hook/supabaseClient";
import useNumerosBloqueados from "../../../hook/useNumerosBloquedos";
import { useState } from "react";

export default function Form() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { setNumerosBloqueados } = useNumerosBloqueados();

  // Estado para almacenar el valor seleccionado del sector

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const id = formData.get("id");
    const numero = formData.get("Numero");
    const valor = formData.get("valor");

    // Validar que todos los campos estén completos
    if (numero === "" || valor === "" || id === "") {
      toast.error("Complete all fields");
      return;
    }

    const { data, error } = await supabase
      .from("bloquear_number")
      .insert([
        {
          id: id,
          numero: numero,
          valor: valor,
        },
      ])
      .select();

    if (error) {
      console.error("Error inserting data:", error.message);
    } else {
      setNumerosBloqueados((prevCountries) => [...prevCountries, ...data]);
      toast.success("Usuario Agregado Correctamente");
      e.target.reset();

      window.location.reload();
    }
  };

  return (
    <>
      <div className="w-full md:max-w-[1300px] mx-auto flex justify-end items-end mt-2 mb-2 mr-2">
        <Button
          onPress={onOpen}
          className="bg-zinc-900 text-white px-2 py-1 rounded-xl"
        >
          Agregar Numero Bloqueado +
        </Button>
      </div>

      <Modal
        backdrop="blur"
        size="2xl"
        style={{
          backgroundColor: "#13151a",
          color: "#fff",
        }}
        className="text-white"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex gap-2 items-center">
                  Agrega un numero
                  <IconGit />
                </div>
              </ModalHeader>
              <ModalBody>
                <form className="text-white" onSubmit={handleSubmit}>
                  <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input
                      className="text-black focus:border-primary"
                      label="id"
                      type="number"
                      name="id"
                      placeholder="id"
                    />
                    <Input
                      className="text-black focus:border-primary"
                      label="Numero"
                      name="Numero"
                      type="text"
                      placeholder="Numero a bloquear"
                    />

                    <Input
                      className="text-black focus:border-primary"
                      label="valor"
                      name="valor"
                      placeholder="Valor maximo"
                      type="number"
                    />
                  </section>

                  <div className="w-full flex justify-center items-center mt-3">
                    <Button
                      type="submit"
                      className="w-[90%] md:w-[50%] bg-white text-black flex items-center gap-2"
                    >
                      Agregar Numero a bloquear
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
    </>
  );
}
