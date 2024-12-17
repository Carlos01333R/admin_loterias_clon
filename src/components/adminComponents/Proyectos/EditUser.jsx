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
import useZonas from "../../../hook/useZona";
export default function EditUser({
  isOpen,
  onOpenChange,
  id,
  nombre,
  email,
  telefono,
  sector,
  password,
  estado,
}) {
  const [iduser, setIdUser] = useState(id);
  const [Nombre, setNombre] = useState(nombre);
  const [Email, setEmail] = useState(email);
  const [Telefono, setTelefono] = useState(telefono);
  const [Sector, setSector] = useState(sector);
  const [Password, setPassword] = useState(password);
  const [Estado, setEstado] = useState(estado);
  const { zonas, loading: loadingZonas, error: errorZonas } = useZonas();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      iduser.length === 0 ||
      Nombre.length === 0 ||
      Email.length === 0 ||
      Telefono.length === 0 ||
      Sector.length === 0 ||
      Password.length === 0
    ) {
      toast.error("Complete all fields");
      return;
    }
    const { data, error } = await supabase
      .from("usuarios")
      .update({
        id: iduser,
        email: Email,
        nombre: Nombre,
        telefono: Telefono,
        password: Password,
        sector: Sector,
        estado: Estado,
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
              Editar Usuario
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
                    value={iduser} // Cambia "id" por "iduser"
                    onChange={(e) => setIdUser(e.target.value)}
                  />

                  <Input
                    className=""
                    label="Nombre Usuario"
                    name="nombre"
                    placeholder="Nombre usuario"
                    type="text"
                    value={Nombre} // Cambia "nombre" por "Nombre"
                    onChange={(e) => setNombre(e.target.value)}
                  />
                  <Input
                    className=""
                    label="Email"
                    name="email"
                    placeholder="Email"
                    type="email"
                    value={Email} // Cambia "email" por "Email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Input
                    className=""
                    label="Telefono"
                    name="telefono"
                    placeholder="Telefono"
                    type="text"
                    value={Telefono} // Cambia "telefono" por "Telefono"
                    onChange={(e) => setTelefono(e.target.value)}
                  />

                  <Input
                    className=""
                    label="Constraseña"
                    name="password"
                    placeholder="Contraseña"
                    type="text"
                    value={Password} // Cambia "password" por "Password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <select
                    className="text-black focus:border-primary rounded-xl text-sm "
                    name="sector"
                    value={Sector}
                    onChange={(e) => setSector(e.target.value)}
                  >
                    <option value="">Seleccione un sector</option>
                    {zonas.map((zona, index) => (
                      <option key={index} value={zona.nombre}>
                        {zona.nombre}
                      </option>
                    ))}
                  </select>
                  <select
                    className="text-black focus:border-primary p-2 rounded-xl"
                    name="estado"
                    id="estado"
                    value={Estado}
                    onChange={(e) => setEstado(e.target.value)}
                  >
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </section>

                <div className="w-full flex justify-center items-center mt-3 ">
                  <Button
                    type="submit"
                    className="w-[90%] md:w-[50%] bg-white text-black flex items-center gap-2"
                  >
                    Editar Usuario
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
