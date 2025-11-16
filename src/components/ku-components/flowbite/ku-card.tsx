import { Card } from "flowbite-react";
import type { IKuCardProps } from "@/interfaces/ku-components";

export const KuCard = (props: IKuCardProps) => {
  const { id, testId, children } = props;
  return (
    <Card className="card" id={id} data-testid={testId}>
      {children}
    </Card>
  );
};