import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";
import { MailIcon } from "../icons/MailIcon.jsx";
import { LockIcon } from "../icons/LockIcon.jsx";
import { Toaster, toast } from "sonner";
import { useState } from "react";
import { useLogin } from "../hook/useLogin.jsx";

export default function ModalAdmin({ isOpen, onOpenChange }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, error } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email === "" || password === "") {
      toast.error("Por favor ingrese todos los campos");
      return;
    }
    await login(email, password);

    // Mostrar mensaje dependiendo del resultado del login
    if (error) {
      toast.error(error); // Mostrar mensaje de error si las credenciales son incorrectas
    } else {
      console.log("Login Successful"); // Mostrar éxito si el login es correcto
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Inicio de Sesión
              </ModalHeader>
              <ModalBody>
                <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
                  <Input
                    autoFocus
                    endContent={
                      <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                    }
                    label="Email"
                    placeholder="Ingresa su Correo"
                    variant="bordered"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                  />
                  <Input
                    endContent={
                      <LockIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                    }
                    label="Password"
                    placeholder="Ingresa su Contraseña"
                    type="password"
                    variant="bordered"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                  />
                  <div className="w-full flex justify-center items-center mb-2">
                    <Button
                      color="dark"
                      type="submit"
                      variant="bordered"
                      className="w-full bg-zinc-700 text-white"
                      disabled={loading}
                    >
                      {loading ? "Cargando..." : "Inicia sesión"}
                    </Button>
                  </div>
                </form>
                <div className="w-full flex justify-end items-center mb-2">
                  <Button
                    onPress={onClose}
                    className="bg-transparent text-red-500"
                  >
                    Cerrar
                  </Button>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </Modal>
      <Toaster position="top-right" />
    </>
  );
}
