import { Spinner } from "flowbite-react";
import { IKuSpinnerProps } from "@/interfaces/ku-components";

export const KuSpinner = (props: IKuSpinnerProps) => {

    const { size = "lg" } = props;
    return (
        <div className="flex justify-center py-10">
            <Spinner size={size} />
        </div>
    );
};