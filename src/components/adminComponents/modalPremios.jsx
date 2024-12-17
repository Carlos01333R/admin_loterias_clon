import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import useObtenerDetallesWin from "../../hook/useObtenerDetallesWin";

export default function ModalPremios({
  isOpen,
  onOpenChange,
  desde,
  hasta,
  zona,
}) {
  const { data, loading, error } = useObtenerDetallesWin(desde, hasta, zona);
  console.log(data);

  const formatPesos = (value) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
    }).format(value);
  };

  return (
    <>
      <Modal size="2xl" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-center">
                Premios de {zona}, desde {desde} hasta {hasta}
              </ModalHeader>
              <ModalBody>
                {loading && <p>Cargando...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {data && data.length > 0 ? (
                  <section className="overflow-x-auto">
                    <table className="min-w-full bg-white border-collapse border border-gray-200">
                      <thead>
                        <tr>
                          <th className="px-4 py-2 border border-gray-300">
                            Fecha
                          </th>
                          <th className="px-4 py-2 border border-gray-300">
                            Boletos
                          </th>
                          <th className="px-4 py-2 border border-gray-300">
                            resultado
                          </th>
                          <th className="px-4 py-2 border border-gray-300">
                            Cliente
                          </th>
                          <th className="px-4 py-2 border border-gray-300">
                            Premio
                          </th>
                          <th className="px-4 py-2 border border-gray-300 ">
                            Vendedor
                          </th>
                          <th className="px-4 py-2 border border-gray-300">
                            Ticket
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.map((venta, index) => (
                          <tr key={index}>
                            <td className="border px-4 py-2">{venta.fecha}</td>
                            <td className="border px-4 py-2">{venta.boleto}</td>
                            <td className="border px-4 py-2">{venta.result}</td>
                            <td className="border px-4 py-2 truncate">
                              {venta.nombre}-{venta.celular}
                            </td>
                            <td className="border px-4 py-2">
                              {formatPesos(venta.premio)}
                            </td>
                            <td className="border px-4 py-2 truncate">
                              {venta.email}
                            </td>
                            <td className="border px-4 py-2">
                              <a
                                href={`https://loteria-ticket-es.vercel.app/ticket?ref_venta=${venta.numero_venta}`}
                                target="_blank"
                                rel="noreferrer"
                                className="bg-zinc-900 text-white rounded-lg px-1 py-2 text-sm truncate"
                              >
                                Descargar el ticket
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </section>
                ) : (
                  <p>No hay ventas para este periodo</p>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
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
