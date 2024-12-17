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
import IconGit from "../../../../icons/IconGit";
import { supabase } from "../../../../hook/supabaseClient";
import useMaximoValorTresCifras from "../../../../hook/useValorMaximoTresCifras";
export default function Form() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { setMaximoValorTresCifras } = useMaximoValorTresCifras();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const id = formData.get("id");
    const ValorMaximo = formData.get("valor");

    if (id === "" || ValorMaximo === "") {
      toast.error("Complete all fields");
      return;
    }

    const { data, error } = await supabase
      .from("maximo_valor_tres_cifras")
      .insert([
        {
          id: id,
          valor: ValorMaximo,
        },
      ])
      .select();

    if (error) {
      console.error("Error inserting data:", error.message);
    } else {
      setMaximoValorTresCifras((prevCountries) => [...prevCountries, ...data]);
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
          Agregar Valor maximo +
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
                  Agrega el valor maximo
                  <IconGit />
                </div>
              </ModalHeader>
              <ModalBody>
                <form className="text-white " onSubmit={handleSubmit}>
                  <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input
                      className="text-black focus:border-primary "
                      autoFocus
                      label="Id"
                      name="id"
                      type="text"
                      placeholder="Id"
                    />

                    <Input
                      className="text-black focus:border-primary "
                      label="Valor maximo"
                      name="valor" // Cambia "name" a "nombre"
                      type="text"
                      placeholder="Valor maximo"
                    />
                  </section>

                  <div className="w-full flex justify-center items-center mt-3 ">
                    <Button
                      type="submit"
                      className="w-[90%] md:w-[50%] bg-white text-black flex items-center gap-2"
                    >
                      Agregar valor maximo
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
