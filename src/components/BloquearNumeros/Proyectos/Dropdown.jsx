/* eslint-disable react/prop-types */
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import DeleteNumeroBloqueado from "./deleteNumero";
import EditNumero from "./EditNumero";

export default function DropdownNumerosBloquedos({ id, numero, valor }) {
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
              Editar Numero
            </button>
          </DropdownItem>
          <DropdownItem key="delete" className="text-danger" color="danger">
            <button className="bg-transparent mr-1" onClick={onOpenDeleteModal}>
              Eliminar Numero
            </button>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <DeleteNumeroBloqueado
        isOpen={isDeleteModalOpen}
        onOpenChange={onDeleteModalChange}
        id={id}
      />
      <EditNumero
        isOpen={isEditModalOpen}
        onOpenChange={onEditModalChange}
        id={id}
        numero={numero}
        valor={valor}
      />
    </>
  );
}
