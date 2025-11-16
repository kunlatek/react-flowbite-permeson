import type { IKuSpinnerProps } from "@/interfaces/ku-components";

export const KuSpinner = (props: IKuSpinnerProps = {}) => {
  const { id, testId } = props;
  return (
    <div className="flex justify-center items-center my-4" id={id} data-testid={testId}>
      <div className="loader" />
    </div>
  );
};