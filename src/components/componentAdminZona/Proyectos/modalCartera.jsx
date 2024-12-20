import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";
import useSalesData from "../../../hook/useSalesData";
import useUsers from "../../../hook/users";
import { useState } from "react";
import { supabase } from "../../../hook/supabaseClient";
import { toast } from "sonner";
import Form from "../../adminComponents/form";
import useVentasHoyAdminZona from "../../../hook/ventasHoyAdminZona";
import TotalByFechas from "./totalByFecha";
import useZonas from "../../../hook/useZona";
import useTotalPremioHoy from "../../../hook/usePremioHoy";

export default function ModalCartera({ isOpen, onOpenChange, email, sector }) {
  const { salesData, loading, error } = useSalesData(email);
  const { valorBrutaHoy, ventaNetaHoy, gananciasHoy } = useVentasHoyAdminZona({
    email,
  });
  const {
    totalPremio,
    loading: loadingPremio,
    error: errorPremio,
  } = useTotalPremioHoy(email);

  const { user } = useUsers();
  const { zonas } = useZonas();

  const adminZona = zonas
    ? zonas.find((z) => z.nombre === sector)?.porcentaje_admin_zona
    : null;

  const adminZonaVentaNeta = zonas
    ? zonas.find((z) => z.nombre === sector)?.porcentaje_loteria
    : null;

  const adminZonaGanancias = zonas
    ? zonas.find((z) => z.nombre === sector)?.porcentaje_cliente
    : null;

  const ventaNetaHoyNew = (valorBrutaHoy * adminZonaVentaNeta) / 100;
  const gananciasHoyNew = (valorBrutaHoy * adminZonaGanancias) / 100;
  const gananciasAdminZonaNew = (valorBrutaHoy * adminZona) / 100;

  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [mora, setMora] = useState("");
  const [desde, setDesde] = useState(null);
  const [hasta, setHasta] = useState(null);

  const formatDate = (date) => {
    if (!date) return "";
    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "Europe/Madrid", // Asegura que uses la zona horaria correcta
    };
    return date.toLocaleDateString("es-ES", options);
  };

  const FormatPesoCOP = (amount) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  const filterByEmail = (userList) => {
    if (!userList) return [];
    if (!email) return userList;
    return userList.filter(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
  };

  const FilteredUsers = filterByEmail(user);

  const handleEditMora = () => {
    onOpenChange(false);
    setEditModalOpen(true);
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (event) => {
    event.preventDefault(); // Previene la recarga de la página
    if (!mora) {
      toast.error("Ingrese un valor válido para la mora"); // Mostrar un mensaje de error si no se ingresa un valor
      return;
    }

    try {
      const userToUpdate = FilteredUsers[0]; // Suponiendo que solo hay un usuario filtrado
      await updateUserMora(userToUpdate.email, mora); // Llama a la función que actualiza la mora del usuario
      setEditModalOpen(false); // Cierra el modal de edición
      setMora(""); // Reinicia el valor de mora
      window.location.reload(); // Refresca la página
    } catch (error) {
      console.error("Error updating mora:", error);
      // Aquí puedes manejar el error de la manera que prefieras
    }
  };

  return (
    <>
      {/* Primer Modal */}
      <Modal
        size="2xl"
        scrollBehavior="inside"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 justify-center items-center">
                <p>Usuario:</p>
                {email}
              </ModalHeader>
              <ModalBody>
                {loading && <p>Loading sales data...</p>}
                {error && <p>Error loading sales data: {error.message}</p>}
                {!loading && !error && (
                  <>
                    <h4 className="font-bold text-center">Ventas Generales</h4>
                    <div className="w-[90%] flex justify-between items-center">
                      <p className="font-bold">Total Valor Bruta:</p>
                      <p className="font-bold text-lg">
                        {FormatPesoCOP(salesData.total_valor_bruta)}
                      </p>
                    </div>
                    <div className="w-[90%] flex justify-between items-center">
                      <p className="font-bold">Total Venta Neta:</p>
                      <p className="font-bold text-lg">
                        {FormatPesoCOP(
                          (salesData.total_valor_bruta * adminZonaVentaNeta) /
                            100
                        )}
                      </p>
                    </div>
                    <div className="w-[90%] flex justify-between items-center">
                      <p className="font-bold">Total Ganancias:</p>
                      <p className="font-bold text-lg">
                        {FormatPesoCOP(
                          (salesData.total_valor_bruta * adminZonaGanancias) /
                            100
                        )}
                      </p>
                    </div>
                    <hr />

                    <h4 className="font-bold text-center">Ventas Hoy</h4>

                    <div className="w-[90%] flex justify-between items-center">
                      <p className="font-bold">Total Valor Bruta:</p>
                      <p className="font-bold text-lg">
                        {FormatPesoCOP(valorBrutaHoy)}
                      </p>
                    </div>
                    <div className="w-[90%] flex justify-between items-center">
                      <p className="font-bold">Total Venta Neta:</p>
                      <p className="font-bold text-lg">
                        {FormatPesoCOP(ventaNetaHoyNew)}
                      </p>
                    </div>
                    <div className="w-[90%] flex justify-between items-center">
                      <p className="font-bold">Ganancias Usuario:</p>
                      <p className="font-bold text-lg">
                        {FormatPesoCOP(gananciasHoyNew)}
                      </p>
                    </div>

                    <div className="w-[90%] flex justify-between items-center">
                      <p className="font-bold">Ganancias Admin Zona:</p>
                      <p className="font-bold text-lg">
                        {FormatPesoCOP(gananciasAdminZonaNew)}
                      </p>
                    </div>

                    <div className="w-[90%] flex justify-between items-center">
                      <p className="font-bold text-lg">
                        Total de entregar a {email}
                      </p>
                      <p className="font-bold text-lg text-green-600">
                        {FormatPesoCOP(ventaNetaHoyNew + gananciasAdminZonaNew)}
                      </p>
                    </div>

                    <div className="w-[90%] flex justify-between items-center">
                      <p className="font-bold">Premios</p>
                      {errorPremio && (
                        <p className="text-red-500">{errorPremio}</p>
                      )}
                      {loadingPremio && <p>Cargando...</p>}
                      {!loadingPremio && (
                        <p className="font-bold text-lg">
                          {FormatPesoCOP(totalPremio)}
                        </p>
                      )}
                    </div>

                    <div className="w-[90%] flex justify-between items-center">
                      <p className="font-bold">Balance</p>
                      {errorPremio && (
                        <p className="text-red-500">{errorPremio}</p>
                      )}
                      {loadingPremio && <p>Cargando...</p>}
                      {totalPremio !== undefined &&
                        ventaNetaHoyNew !== undefined &&
                        totalPremio !== 0 && (
                          <p
                            className={`font-bold text-lg ${
                              ventaNetaHoyNew - totalPremio < 0
                                ? "text-red-500"
                                : "text-blue-500"
                            }`}
                          >
                            {FormatPesoCOP(ventaNetaHoyNew - totalPremio)}
                          </p>
                        )}
                      {totalPremio === 0 && (
                        <p className="font-bold text-lg text-zinc-900">
                          Sin premio
                        </p>
                      )}
                    </div>

                    {FilteredUsers.length > 0 ? (
                      FilteredUsers.map((user) => (
                        <div
                          key={user.id}
                          className="w-[90%] flex justify-between items-center"
                        >
                          <p className="font-bold">Mora</p>
                          <p className="font-bold text-lg text-red-500">
                            {FormatPesoCOP(user.mora)}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p>No se encontraron usuarios.</p>
                    )}
                  </>
                )}

                <section className="w-full mb-5">
                  <Form desde={setDesde} hasta={setHasta} />
                </section>
                {desde !== null && hasta !== null ? (
                  <>
                    <section>
                      <TotalByFechas
                        desde={formatDate(desde)}
                        hasta={formatDate(hasta)}
                        email={email}
                        sector={sector}
                      />
                    </section>
                  </>
                ) : (
                  <h2 className="text-xl font-bold text-zinc-900 text-center mt-5s">
                    Selecciona las fechas de venta
                  </h2>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cerrar
                </Button>
                <Button color="primary" onPress={handleEditMora}>
                  Editar mora
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Segundo Modal para Editar Mora */}
      <Modal isOpen={isEditModalOpen} onOpenChange={setEditModalOpen}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 justify-center items-center">
                <p>Editar Mora</p>
              </ModalHeader>
              <ModalBody>
                <form onSubmit={handleSubmit}>
                  <Input
                    type="number"
                    label="Nuevo Valor de Mora"
                    placeholder="Ingrese el nuevo valor de mora"
                    value={mora}
                    onChange={(e) => setMora(e.target.value)}
                    required
                  />
                  <p className="mt-2 text-gray-600">
                    Asegúrese de ingresar un valor válido.
                  </p>
                  <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                      Cancelar
                    </Button>
                    <Button color="primary" type="submit">
                      Guardar Cambios
                    </Button>
                  </ModalFooter>
                </form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

// Función que actualiza la mora en la base de datos de Supabase
const updateUserMora = async (email, newMora) => {
  const { data, error } = await supabase
    .from("usuarios") // Cambia 'usuarios' al nombre de tu tabla si es diferente
    .update({ mora: newMora })
    .eq("email", email); // Filtra por email

  if (error) {
    throw new Error(error.message); // Lanza un error si hay problemas
  }

  return data; // Retorna los datos actualizados si es necesario
};
