import { Modal } from "flowbite-react";
import type { IKuModalProps } from "@/interfaces/ku-components";

export const KuModal = (props: IKuModalProps) => {
  return (
    <Modal show={props.show}>
      {props.title && <Modal.Header>{props.title}</Modal.Header>}
      <Modal.Body>{props.children}</Modal.Body>
    </Modal>
  );
};
