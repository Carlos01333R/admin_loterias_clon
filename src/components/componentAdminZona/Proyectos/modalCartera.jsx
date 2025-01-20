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

  const itemsHoy = [
    {
      name: "Venta Bruta",
      subName: "Venta Bruta general",
      value: FormatPesoCOP(valorBrutaHoy),
      logo: "https://cdn-icons-png.flaticon.com/512/5305/5305244.png",
    },
    {
      name: "Venta Neta",
      subName: "Venta Neta general",
      value: FormatPesoCOP(ventaNetaHoyNew),
      logo: "https://images.vexels.com/media/users/3/147974/isolated/preview/22ed2b8524101426e7b490c95097a8f2-icono-de-ventas-comerciales.png",
    },
    {
      name: "premios",
      subName: "premios general",
      value: FormatPesoCOP(totalPremio),
      logo: "https://cdn-icons-png.flaticon.com/512/10997/10997932.png",
    },
    {
      name: "Ganancias Admin zona",
      subName: "Ganancias admin general",
      value: FormatPesoCOP(gananciasAdminZonaNew),
      logo: "https://cdn-icons-png.freepik.com/512/10997/10997932.png",
    },
    {
      name: "Ganancias usuarios",
      subName: "Ganancias usuarios general",
      value: FormatPesoCOP(gananciasHoyNew),
      logo: "https://cdn-icons-png.flaticon.com/512/10997/10997932.png",
    },
    {
      name: `total a entregar `,
      subName: "total de entrega",
      value: FormatPesoCOP(ventaNetaHoyNew + gananciasAdminZonaNew),
      logo: "https://cdn-icons-png.flaticon.com/512/10997/10997932.png",
    },
    {
      name: "balance",
      subName: "balance general",
      value: FormatPesoCOP(ventaNetaHoyNew - totalPremio),
      logo: "https://cdn-icons-png.flaticon.com/512/10997/10997932.png",
    },
  ];

  return (
    <>
      {/* Primer Modal */}
      <Modal
        size="2xl"
        scrollBehavior="inside"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop="blur"
        className="bg-[#F4F6FA]"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 justify-center items-center">
                <section class="w-full flex justify-center md:justify-end items-center text-white">
                  <p class="text-center font-bold flex items-center text-xl text-black pr-4 gap-x-2">
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/4042/4042356.png"
                      alt=""
                      class="w-6 h-6"
                    />
                    {email}
                  </p>
                </section>
              </ModalHeader>
              <ModalBody>
                {loading && <p>Loading sales data...</p>}
                {error && <p>Error loading sales data: {error.message}</p>}
                {!loading && !error && (
                  <>
                    <section class="w-full flex justify-center  items-center text-white">
                      <p class="text-center font-bold flex items-center text-xl text-black pr-4 gap-x-2">
                        <img
                          src="https://cdn-icons-png.flaticon.com/512/5305/5305244.png"
                          alt=""
                          class="w-6 h-6"
                        />
                        venta generales
                      </p>
                    </section>

                    <div className="w-[90%] flex justify-between items-center">
                      <p className="font-bold text-xl">Total Valor Bruta:</p>
                      <p className="font-bold text-2xl text-[#3DB078] text-center">
                        {FormatPesoCOP(salesData.total_valor_bruta)}
                      </p>
                    </div>
                    <div className="w-[90%] flex justify-between items-center">
                      <p className="font-bold text-xl">Total Venta Neta:</p>
                      <p className="font-bold text-2xl text-[#3DB078] text-center">
                        {FormatPesoCOP(
                          (salesData.total_valor_bruta * adminZonaVentaNeta) /
                            100
                        )}
                      </p>
                    </div>
                    <div className="w-[90%] flex justify-between items-center">
                      <p className="font-bold text-xl">Total Ganancias:</p>
                      <p className="font-bold text-2xl text-[#3DB078] text-center">
                        {FormatPesoCOP(
                          (salesData.total_valor_bruta * adminZonaGanancias) /
                            100
                        )}
                      </p>
                    </div>
                    <hr />

                    <section class="w-full flex justify-center  items-center text-white">
                      <p class="text-center font-bold flex items-center text-xl text-black pr-4 gap-x-2">
                        <img
                          src="https://cdn-icons-png.flaticon.com/512/5305/5305244.png"
                          alt=""
                          class="w-6 h-6"
                        />
                        Ventas Hoy
                      </p>
                    </section>

                    <section className="w-full p-4 grid grid-cols-1 md:grid-cols-3 gap-x-5 gap-y-2 md:gap-y-2">
                      {itemsHoy.map((item, index) => (
                        <div
                          key={index}
                          className="w-full flex flex-col justify-center items-center bg-white rounded-xl p-3 hover:scale-105 transition duration-300 ease-in-out transform shadow-[0px_5px_17px_-1px_rgba(204,204,204,0.65)]"
                        >
                          {/* Nombre del item */}
                          <p className="text-lg font-bold text-zinc-900 truncate">
                            {item.name}
                          </p>

                          {/* Renderizado especial para balance */}
                          {item.name === "balance" ? (
                            <>
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
                                    {item.value}
                                  </p>
                                )}
                              {totalPremio === 0 && (
                                <p className="font-bold text-lg text-zinc-900">
                                  Sin balance
                                </p>
                              )}
                            </>
                          ) : (
                            // Valor normal para los demás items
                            <p className="font-extrabold text-[#3DB078] text-2xl truncate">
                              {item.value}
                            </p>
                          )}

                          {/* Subtítulo */}
                          <small className="text-xs-small text-[#F5BE40]">
                            {item.subName}
                          </small>
                        </div>
                      ))}
                      {FilteredUsers.length > 0 ? (
                        FilteredUsers.map((user) => (
                          <div
                            key={user.id}
                            className="w-full flex flex-col justify-center items-center bg-white rounded-xl p-3 hover:scale-105 transition duration-300 ease-in-out transform shadow-[0px_5px_17px_-1px_rgba(204,204,204,0.65)]"
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
                    </section>
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
