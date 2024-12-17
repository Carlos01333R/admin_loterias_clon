/* eslint-disable react/prop-types */
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import DeleteUser from "./deleteUser";
import EditUser from "./EditUser";

export default function DropdownProyect({
  id,
  nombre,
  email,
  telefono,
  sector,
  password,
  estado,
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
              Editar Usuario
            </button>
          </DropdownItem>
          <DropdownItem key="delete" className="text-danger" color="danger">
            <button className="bg-transparent mr-1" onClick={onOpenDeleteModal}>
              Eliminar Usuario
            </button>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <DeleteUser
        isOpen={isDeleteModalOpen}
        onOpenChange={onDeleteModalChange}
        Name={nombre}
        id={id}
      />
      <EditUser
        isOpen={isEditModalOpen}
        onOpenChange={onEditModalChange}
        id={id}
        nombre={nombre}
        email={email}
        telefono={telefono}
        sector={sector}
        password={password}
        estado={estado}
      />
    </>
  );
}
