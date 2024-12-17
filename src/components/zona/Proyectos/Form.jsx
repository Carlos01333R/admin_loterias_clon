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
import useZonas from "../../../hook/useZona";

export default function Form() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { setZonas } = useZonas();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const id = formData.get("id");
    const nombre = formData.get("nombre");
    const porcentaje_loteria = formData.get("porcentaje_loteria");
    const porcentaje_cliente = formData.get("porcentaje_cliente");
    const porcentaje_admin_zona = formData.get("porcentaje_admin_zona");

    if (
      id === "" ||
      nombre === "" ||
      porcentaje_loteria === "" ||
      porcentaje_cliente === "" ||
      porcentaje_admin_zona === ""
    ) {
      toast.error("Complete all fields");
      return;
    }

    const { data, error } = await supabase
      .from("zonas")
      .insert([
        {
          id: id,
          nombre: nombre,
          porcentaje_loteria: porcentaje_loteria,
          porcentaje_cliente: porcentaje_cliente,
          porcentaje_admin_zona: porcentaje_admin_zona,
        },
      ])
      .select();

    if (error) {
      console.error("Error inserting data:", error.message);
    } else {
      setZonas((prevCountries) => [...prevCountries, ...data]);
      toast.success("zona Agregada Correctamente");
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
          Agregar Zona +
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
                  Agrega una zona
                  <IconGit />
                </div>
              </ModalHeader>
              <ModalBody>
                <form className="text-white " onSubmit={handleSubmit}>
                  <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input
                      className="text-black focus:border-primary "
                      autoFocus
                      label="Id zona"
                      name="id"
                      type="text"
                      placeholder="Id zona"
                    />

                    <Input
                      className="text-black focus:border-primary "
                      label="Nombre de la zona"
                      name="nombre" // Cambia "name" a "nombre"
                      type="text"
                      placeholder="Nombre de la zona"
                    />

                    <Input
                      className="text-black focus:border-primary "
                      label="Porcentaje loteria"
                      name="porcentaje_loteria"
                      placeholder="Porcentaje loteria"
                      type="number"
                    />

                    <Input
                      className="text-black focus:border-primary "
                      label="Porcentaje cliente"
                      name="porcentaje_cliente"
                      placeholder="Porcentaje cliente"
                      type="number"
                    />
                    <Input
                      className="text-black focus:border-primary"
                      label="porcentaje admin zona"
                      name="porcentaje_admin_zona"
                      placeholder="Porcentaje admin zona"
                      type="number"
                    />
                  </section>

                  <div className="w-full flex justify-center items-center mt-3 ">
                    <Button
                      type="submit"
                      className="w-[90%] md:w-[50%] bg-white text-black flex items-center gap-2"
                    >
                      Agregar Zona
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
