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
import IconGit from "../icons/IconGit";
import { supabase } from "../hook/supabaseClient";
import useGanadores from "../hook/ganadores";
export default function FormGanadores() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { setGanadores } = useGanadores();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const nombre = formData.get("nombre");
    const telefono = formData.get("telefono");
    const zona = formData.get("zona");
    const fecha = formData.get("fecha");

    if (nombre === "" || telefono === "" || zona === "" || fecha === "") {
      toast.error("Complete all fields");
      return;
    }

    const { data, error } = await supabase
      .from("ganadores")
      .insert([
        {
          nombre: nombre,
          telefono: telefono,
          zona: zona,
          fecha: fecha,
        },
      ])
      .select();

    if (error) {
      console.error("Error inserting data:", error.message);
    } else {
      setGanadores((prevCountries) => [...prevCountries, ...data]);
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
          Agregar Ganador +
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
                  Agrega un usuario
                  <IconGit />
                </div>
              </ModalHeader>
              <ModalBody>
                <form className="text-white " onSubmit={handleSubmit}>
                  <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input
                      className="text-black focus:border-primary "
                      autoFocus
                      label="nombre"
                      name="nombre"
                      type="text"
                      placeholder="nombre del ganador"
                    />

                    <Input
                      className="text-black focus:border-primary "
                      label="telefono"
                      name="telefono" // Cambia "name" a "nombre"
                      type="text"
                      placeholder="telefono"
                    />

                    <Input
                      className="text-black focus:border-primary "
                      label="zona"
                      name="zona"
                      placeholder="Fredonia, pozon ...."
                      type="text"
                    />

                    <Input
                      className="text-black focus:border-primary "
                      label="fecha"
                      name="fecha"
                      placeholder="fecha"
                      type="date"
                    />
                  </section>

                  <div className="w-full flex justify-center items-center mt-3 ">
                    <Button
                      type="submit"
                      className="w-[90%] md:w-[50%] bg-white text-black flex items-center gap-2"
                    >
                      Agregar Ganadores
                      <IconGit />
                    </Button>
                  </div>
                </form>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
