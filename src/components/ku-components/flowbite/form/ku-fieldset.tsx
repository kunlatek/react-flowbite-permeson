import { IKuFieldsetProps } from "@/interfaces/ku-components";

export const KuFieldset = (props: IKuFieldsetProps) => {
  const { id, title, children } = props;
  return (
    <fieldset
      id={id}
      className="w-full bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 border border-gray-200 dark:border-gray-700"
    >
      <legend className="text-lg font-medium text-gray-900 dark:text-white mb-3 px-2">
        {title}
      </legend>
      <div className="space-y-4">{children}</div>
    </fieldset>
  );
};
