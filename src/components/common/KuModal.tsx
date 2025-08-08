import { Modal, type ModalProps } from "flowbite-react";

interface KuModalProps extends Omit<ModalProps, "show"> {
  show: boolean;
  title: string;
  children: React.ReactNode;
}

export default function KuModal({
  show,
  title,
  children,
  ...props
}: KuModalProps) {
  return (
    <Modal show={show} {...props}>
      <Modal.Header>{title}</Modal.Header>
      <Modal.Body>{children}</Modal.Body>
    </Modal>
  );
}
