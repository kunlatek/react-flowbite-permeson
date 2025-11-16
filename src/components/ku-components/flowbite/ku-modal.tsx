import { Modal } from "flowbite-react";
import type { IKuModalProps } from "@/interfaces/ku-components";

export const KuModal = (props: IKuModalProps) => {
  const { id, testId, show, title, children } = props;
  return (
    <Modal show={show} id={id} data-testid={testId}>
      {title && <Modal.Header>{title}</Modal.Header>}
      <Modal.Body>{children}</Modal.Body>
    </Modal>
  );
};
