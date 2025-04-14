"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Button,
  Spinner,
  Card,
  CardBody,
  Input,
  useDisclosure,
} from "@nextui-org/react";
import { toast } from "sonner";
import ModalEditarLoteria from "./ModalEditarLoteria";
import AgregarLoteriaModal from "./AgregarLoteriaModal";
import { useLoterias } from "../hook/useLoterias";
import { supabase } from "../hook/supabaseClient";
import ModalBloquear from "./modalbloquear";

export default function TablaLoterias() {
  const { loterias, isLoading, error, reloadLoterias } = useLoterias();
  const [loteriaEditando, setLoteriaEditando] = useState(null);
  const [isAgregarModalOpen, setIsAgregarModalOpen] = useState(false);
  const [filterLoterias, setFilterLoterias] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleSave = async () => {
    setLoteriaEditando(null);
    toast.success("Lotería actualizada con éxito");
    await reloadLoterias();
  };

  const handleAgregarLoteria = async () => {
    await reloadLoterias();
  };

  const handleEliminarLoteria = async (loteriaName) => {
    try {
      const { data, error } = await supabase.from("loterias").select("*");

      if (error) throw error;

      const loteriasActualizadas = data[0].data.loterias.filter(
        (loteria) => loteria.name !== loteriaName
      );

      const { error: updateError } = await supabase
        .from("loterias")
        .update({ data: { loterias: loteriasActualizadas } })
        .eq("id", data[0].id);

      if (updateError) throw updateError;

      toast.success("Lotería eliminada con éxito");
      await reloadLoterias();
    } catch (error) {
      console.error("Error al eliminar la lotería:", error);
      toast.error("Error al eliminar la lotería");
    }
  };

  const filtrarLoterias = loterias.filter((loteria) =>
    loteria.name.toLowerCase().includes(filterLoterias.toLowerCase())
  );

  /**
   useEffect para abrir el modal de bloqueo
   cuando se carga la página
  useEffect(() => {
    onOpen();
  }, []);

   */

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner
          label="Cargando loterías..."
          color="default"
          labelColor="white"
        />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardBody>
          <p className="text-center text-danger">{error}</p>
        </CardBody>
      </Card>
    );
  }

  return (
    <div>
      <section className="w-full px-4 py-2 border-b border-zinc-200 flex justify-end items-center">
        <div className="flex gap-x-4">
          <Input
            label="Filtrar por nombre"
            value={filterLoterias}
            onChange={(e) => setFilterLoterias(e.target.value)}
          />
          <button
            className="px-4 py-1 md:py-2 bg-black text-white rounded-lg w-[250px]"
            color="primary"
            onClick={() => setIsAgregarModalOpen(true)}
          >
            Agregar Lotería
          </button>
        </div>
      </section>

      <section className="w-full px-4 py-2 border-b border-zinc-200">
        <Table aria-label="Tabla de Loterías">
          <TableHeader>
            <TableColumn>NOMBRE</TableColumn>
            <TableColumn>LOGO</TableColumn>
            <TableColumn>ACCIONES</TableColumn>
          </TableHeader>
          <TableBody>
            {filtrarLoterias.map((loteria, index) => (
              <TableRow key={index}>
                <TableCell>{loteria.name}</TableCell>
                <TableCell>
                  <User
                    name={loteria.name}
                    avatarProps={{
                      src: loteria.logo,
                    }}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      color="default"
                      onPress={() => setLoteriaEditando(loteria)}
                    >
                      Editar
                    </Button>
                    <Button
                      color="danger"
                      onPress={() => handleEliminarLoteria(loteria.name)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>

      {loteriaEditando && (
        <ModalEditarLoteria
          loteria={loteriaEditando}
          onClose={() => setLoteriaEditando(null)}
          onSave={handleSave}
        />
      )}
      <AgregarLoteriaModal
        isOpen={isAgregarModalOpen}
        onClose={() => setIsAgregarModalOpen(false)}
        onSave={handleAgregarLoteria}
      />
      <ModalBloquear isOpen={isOpen} onOpenChange={onOpenChange} />
    </div>
  );
}
