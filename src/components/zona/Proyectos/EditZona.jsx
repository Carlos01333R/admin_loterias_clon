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

export default function EditZona({
  isOpen,
  onOpenChange,
  id,
  nombre,
  porcentaje_loteria,
  porcentaje_cliente,
  porcentaje_admin_zona,
}) {
  const [iduser, setIdUser] = useState(id);
  const [Nombre, setNombre] = useState(nombre);
  const [loteriaPercentage, setLoteriaPercentage] =
    useState(porcentaje_loteria);
  const [clientePercentage, setClientePercentage] =
    useState(porcentaje_cliente);
  const [AdminZona, setAdminZona] = useState(porcentaje_admin_zona);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      iduser.length === 0 ||
      Nombre.length === 0 ||
      loteriaPercentage.length === 0 ||
      clientePercentage.length === 0 ||
      AdminZona.length === 0
    ) {
      toast.error("Complete all fields");
      return;
    }
    const { data, error } = await supabase
      .from("zonas")
      .update({
        id: iduser,
        nombre: Nombre,
        porcentaje_loteria: loteriaPercentage,
        porcentaje_cliente: clientePercentage,
        porcentaje_admin_zona: AdminZona,
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
              Editar Zonas
            </ModalHeader>
            <ModalBody>
              <form className="text-white" onSubmit={handleSubmit}>
                <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    className="text-white focus:border-primary"
                    autoFocus
                    label="Id Usuario"
                    name="id"
                    type="text"
                    placeholder="id usuario"
                    value={iduser}
                    onChange={(e) => setIdUser(e.target.value)}
                  />

                  <Input
                    label="Nombre Zona"
                    name="nombre"
                    placeholder="Nombre de la zona"
                    type="text"
                    value={Nombre}
                    onChange={(e) => setNombre(e.target.value)}
                  />
                  <Input
                    label="Porcentaje loteria"
                    name="porcentaje_loteria"
                    placeholder="Porcentaje loteria"
                    type="text"
                    value={loteriaPercentage}
                    onChange={(e) => setLoteriaPercentage(e.target.value)}
                  />

                  <Input
                    label="Porcentaje cliente"
                    name="porcentaje_cliente"
                    placeholder="Porcentaje cliente"
                    type="text"
                    value={clientePercentage}
                    onChange={(e) => setClientePercentage(e.target.value)}
                  />

                  <Input
                    label="Porcentaje admin zona"
                    name="porcentaje_admin_zona"
                    placeholder="Porcentaje admin zona"
                    type="text"
                    value={AdminZona}
                    onChange={(e) => setAdminZona(e.target.value)}
                  />
                </section>

                <div className="w-full flex justify-center items-center mt-3">
                  <Button
                    type="submit"
                    className="w-[90%] md:w-[50%] bg-white text-black flex items-center gap-2"
                    textValue="Editar Zonas"
                  >
                    Editar Zonas
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
  );
}
