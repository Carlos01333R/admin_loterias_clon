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
import useAdminZona from "../../../hook/adminZona";
import useZonas from "../../../hook/useZona";
import { useState } from "react";

export default function Form() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { setAdminZona } = useAdminZona();
  const { zonas } = useZonas();

  // Estado para almacenar el valor seleccionado del sector
  const [selectedSector, setSelectedSector] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const id = formData.get("id");
    const nombre = formData.get("nombre");
    const email = formData.get("email");
    const telefono = formData.get("telefono");
    const password = formData.get("password");

    // Validar que todos los campos estén completos
    if (
      id === "" ||
      nombre === "" ||
      email === "" ||
      telefono === "" ||
      selectedSector === "" ||
      password === ""
    ) {
      toast.error("Complete all fields");
      return;
    }

    // Confirmar que `selectedSector` tiene el valor correcto
    console.log("Sector seleccionado:", selectedSector);

    const { data, error } = await supabase
      .from("admin_zona")
      .insert([
        {
          id: id,
          nombre: nombre,
          email: email,
          telefono: telefono,
          password: password,
          sector: selectedSector, // Utilizamos el estado seleccionado aquí
        },
      ])
      .select();

    if (error) {
      console.error("Error inserting data:", error.message);
    } else {
      setAdminZona((prevCountries) => [...prevCountries, ...data]);
      toast.success("Usuario Agregado Correctamente");
      e.target.reset();
      setSelectedSector(""); // Reiniciar el valor del sector
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
          Agregar Admin Zona +
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
                <form className="text-white" onSubmit={handleSubmit}>
                  <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input
                      className="text-black focus:border-primary"
                      autoFocus
                      label="Id cliente"
                      name="id"
                      type="text"
                      placeholder="Id del cliente"
                    />

                    <Input
                      className="text-black focus:border-primary"
                      label="Nombre"
                      name="nombre"
                      type="text"
                      placeholder="Nombre del proyecto"
                    />

                    <Input
                      className="text-black focus:border-primary"
                      label="Email"
                      name="email"
                      placeholder="Email"
                      type="email"
                    />
                    <Input
                      className="text-black focus:border-primary"
                      label="Telefono"
                      name="telefono"
                      placeholder="Telefono"
                      type="text"
                    />
                    <Input
                      className="text-black focus:border-primary"
                      label="Constraseña"
                      name="password"
                      placeholder="Contraseña"
                      type="text"
                    />
                    <select
                      value={selectedSector}
                      onChange={(e) => {
                        setSelectedSector(e.target.value);
                      }}
                      className="text-black focus:border-primary rounded-xl text-sm"
                    >
                      <option value="" disabled>
                        Seleccione un sector
                      </option>
                      {zonas.map((zona) => (
                        <option value={zona.nombre} key={zona.id}>
                          {zona.nombre}
                        </option>
                      ))}
                    </select>
                  </section>

                  <div className="w-full flex justify-center items-center mt-3">
                    <Button
                      type="submit"
                      className="w-[90%] md:w-[50%] bg-white text-black flex items-center gap-2"
                    >
                      Agregar Admin
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
