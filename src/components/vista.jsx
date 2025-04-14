"use client";

import {
  Card,
  CardBody,
  CardHeader,
  Image,
  DatePicker,
  useDisclosure,
  Button,
} from "@nextui-org/react";
import useUsers from "../hook/users";
import { useEffect, useState } from "react";
import VistaInfo from "./vistaInfo";
import ModalBloquear from "./modalbloquear";

export default function VistaUsuario() {
  const { user, loading } = useUsers();
  const [selectUser, setSelectUser] = useState(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleFechaChange = (date) => {
    if (date) {
      const { year, month, day } = date;
      const selectedDate = new Date(year, month - 1, day);
      const formattedDate = selectedDate.toLocaleDateString("es-CO", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      setFechaSeleccionada(formattedDate);
    } else {
      console.log("No se ha seleccionado una fecha válida.");
    }
  };

  const handleUserChange = (event) => {
    const selectedEmail = event.target.value;
    const selectedUser = user.find((u) => u.email === selectedEmail);
    setSelectUser(
      selectedUser
        ? { email: selectedUser.email, sector: selectedUser.sector }
        : null
    );
  };

  /**
   useEffect para abrir el modal de bloqueo
   cuando se carga la página
 

   */

  return (
    <>
      <section className="w-full flex px-3 py-2 justify-center items-center">
        <Card className="w-full px-4 md:max-w-3xl mx-auto flex justify-center items-center">
          <CardHeader className="flex justify-center">
            <h2 className="text-2xl font-bold">Análisis de usuarios</h2>
          </CardHeader>
          <CardBody className="w-full justify-center items-center">
            {loading && <p className="w-full text-center">Loading...</p>}
            {!loading && user && (
              <section className="w-full flex flex-col md:flex-row px-3 py-2 justify-center items-center gap-4">
                {/* Select normal */}
                <div className="w-full md:w-1/2">
                  <select
                    id="user-select"
                    className="w-full p-3 text-base border border-default-200 rounded-lg shadow-sm bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                    value={selectUser ? selectUser.email : ""}
                    onChange={handleUserChange}
                  >
                    <option value="" className="text-gray-500">
                      Selecciona un usuario
                    </option>
                    {user.map((user) => (
                      <option
                        key={user.email}
                        value={user.email}
                        className="text-base"
                      >
                        {user.email} - {user.sector}
                      </option>
                    ))}
                  </select>
                </div>

                {/* DatePicker */}
                <div className="w-full md:w-1/2">
                  <DatePicker
                    className="w-full"
                    onChange={handleFechaChange}
                    size="lg"
                    aria-label="Seleccionar fecha"
                  />
                </div>
              </section>
            )}
          </CardBody>
        </Card>
      </section>

      <ModalBloquear isOpen={isOpen} onOpenChange={onOpenChange} />

      {selectUser && fechaSeleccionada ? (
        <VistaInfo
          selectUser={selectUser.email}
          fechaSeleccionada={fechaSeleccionada}
          sector={selectUser.sector}
        />
      ) : (
        <p className="text-center "> Selecciona el usuario y la fecha</p>
      )}
    </>
  );
}
