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
import loteriasData from "../../../data/loterias.json";
import { useState } from "react";

export default function Form() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { setZonas } = useZonas();
  const [selectedSector, setSelectedSector] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const resultado = formData.get("resultado");
    const fecha = formData.get("fecha");

    if (selectedSector == "" || resultado === "" || fecha === "") {
      toast.error("Complete all fields");
      return;
    }

    const { data, error } = await supabase
      .from("resultados_loteria")
      .insert([
        {
          lottery: selectedSector,
          result: resultado,
          date: fecha,
        },
      ])
      .select();

    if (error) {
      console.error("Error inserting data:", error.message);
    } else {
      setZonas((prevCountries) => [...prevCountries, ...data]);
      toast.success("Resultado Agregado Correctamente");
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
          Agregar Resultado +
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
                  Agrega un resultado
                  <IconGit />
                </div>
              </ModalHeader>
              <ModalBody>
                <form className="text-white " onSubmit={handleSubmit}>
                  <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <select
                      name="loteria"
                      className="text-black focus:border-primary rounded-xl text-sm "
                      value={selectedSector} // Usé loteriaState aquí
                      onChange={(e) => {
                        setSelectedSector(e.target.value);
                      }}
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
                      className="text-black focus:border-primary "
                      label="Resultado"
                      name="resultado" // Correcto
                      placeholder="Resultado de la lotería"
                      type="text"
                    />

                    <Input
                      className="text-black focus:border-primary "
                      label="Fecha"
                      name="fecha" // Correcto
                      placeholder="Fecha de la lotería"
                      type="date"
                    />
                  </section>

                  <div className="w-full flex justify-center items-center mt-3 ">
                    <Button
                      type="submit"
                      className="w-[90%] md:w-[50%] bg-white text-black flex items-center gap-2"
                    >
                      Agregar Resultado
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
