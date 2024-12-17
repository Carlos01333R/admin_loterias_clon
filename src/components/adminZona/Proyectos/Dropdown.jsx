/* eslint-disable react/prop-types */
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import DeleteAdmin from "./deleteAdmin";
import EditAdmin from "./EditAdmin";

export default function DropdownAdminZona({
  id,
  nombre,
  email,
  telefono,
  sector,
  password,
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
              Editar Admin
            </button>
          </DropdownItem>
          <DropdownItem key="delete" className="text-danger" color="danger">
            <button className="bg-transparent mr-1" onClick={onOpenDeleteModal}>
              Eliminar Admin
            </button>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <DeleteAdmin
        isOpen={isDeleteModalOpen}
        onOpenChange={onDeleteModalChange}
        Name={nombre}
        id={id}
      />
      <EditAdmin
        isOpen={isEditModalOpen}
        onOpenChange={onEditModalChange}
        id={id}
        nombre={nombre}
        email={email}
        telefono={telefono}
        sector={sector}
        password={password}
      />
    </>
  );
}
