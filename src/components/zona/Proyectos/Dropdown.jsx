/* eslint-disable react/prop-types */
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import DeleteZona from "./deleteZona";
import EditZona from "./EditZona";
import EditarPremiosModal from "./EditarPremiosModal";

export default function DropdownZona({
  id,
  nombre,
  porcentaje_loteria,
  porcentaje_cliente,
  porcentaje_admin_zona,
}) {
  const {
    isOpen: isDeleteModalOpen,
    onOpen: onOpenDeleteModal,
    onOpenChange: onDeleteModalChange,
  } = useDisclosure();

  const {
    isOpen: isEditModalOpen,
    onOpen: onOpenEditModal,
    onOpenChange: onEditModalChange,
  } = useDisclosure();

  const {
    isOpen: isEditarPremiosModalOpen,
    onOpen: onOpenEditarPremiosModal,
    onOpenChange: onEditarPremiosModalChange,
  } = useDisclosure();

  return (
    <>
      <Dropdown>
        <DropdownTrigger>
          <Button className="text-white bg-transparent border-2 border-white">
            Editar
          </Button>
        </DropdownTrigger>
        <DropdownMenu className="text-black" aria-label="Static Actions">
          <DropdownItem key="edit">
            <button className="bg-transparent mr-1" onClick={onOpenEditModal}>
              Editar Admin
            </button>
          </DropdownItem>
          <DropdownItem key="editPremios">
            <button
              className="bg-transparent mr-1"
              onClick={onOpenEditarPremiosModal}
            >
              Editar Premios
            </button>
          </DropdownItem>
          <DropdownItem key="delete" className="text-danger" color="danger">
            <button className="bg-transparent mr-1" onClick={onOpenDeleteModal}>
              Eliminar Admin
            </button>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <DeleteZona
        isOpen={isDeleteModalOpen}
        onOpenChange={onDeleteModalChange}
        Name={nombre}
        id={id}
      />
      <EditZona
        isOpen={isEditModalOpen}
        onOpenChange={onEditModalChange}
        id={id}
        nombre={nombre}
        porcentaje_loteria={porcentaje_loteria}
        porcentaje_cliente={porcentaje_cliente}
        porcentaje_admin_zona={porcentaje_admin_zona}
      />
      <EditarPremiosModal
        isOpen={isEditarPremiosModalOpen}
        onOpenChange={onEditarPremiosModalChange}
        id={id}
        nombre={nombre}
      />
    </>
  );
}
