import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
} from "@nextui-org/react";

export default function ModalBloquear({ isOpen }) {
  return (
    <section className="w-full flex justify-center items-center">
      <Modal
        size="xl"
        isOpen={isOpen}
        isDismissable={false}
        hideCloseButton={true}
        backdrop="opaque"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <p className="text-center bg-red-500 ">¡Atención!</p>
            <p className="text-center">La página no está disponible</p>
          </ModalHeader>
          <ModalBody>
            <Button>
              <a href="/admin/dashboard">Volver a la página principal</a>
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </section>
  );
}
