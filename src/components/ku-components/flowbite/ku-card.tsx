import { Card } from "flowbite-react";
import type { IKuCardProps } from "@/interfaces/ku-components";

export const KuCard = (props: IKuCardProps) => {
  return (
    <Card className="card">
      {props.children}
    </Card>
  );
};