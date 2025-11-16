import type { IKuCardProps } from "@/interfaces/ku-components";

export const KuCard = (props: IKuCardProps) => {
  const { id, testId, children } = props;
  return (
    <KuCard id={id} data-testid={testId}>
      {children}
    </KuCard>
  );
};