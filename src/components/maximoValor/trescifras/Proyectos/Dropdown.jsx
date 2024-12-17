/* eslint-disable react/prop-types */
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import DeleteMaximoValor from "./deleteMaximoValor";
import EditMaximoValor from "./EditMaximoValor";

export default function DropdownMaximoValor({ id, valor }) {
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
              Editar Valor Maximo
            </button>
          </DropdownItem>
          <DropdownItem key="delete" className="text-danger" color="danger">
            <button className="bg-transparent mr-1" onClick={onOpenDeleteModal}>
              Eliminar Valor Maximo
            </button>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <DeleteMaximoValor
        isOpen={isDeleteModalOpen}
        onOpenChange={onDeleteModalChange}
        Name={valor}
        id={id}
      />
      <EditMaximoValor
        isOpen={isEditModalOpen}
        onOpenChange={onEditModalChange}
        id={id}
        valor={valor}
      />
    </>
  );
}
