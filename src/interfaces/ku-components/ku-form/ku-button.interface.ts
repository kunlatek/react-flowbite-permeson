import { IFormButton } from "@/models/form";
import { cva, VariantProps } from "class-variance-authority";

export const buttonVariants = cva(
    "font-medium focus:ring-4 focus:outline-none rounded-lg inline-flex items-center justify-center",
    {
        variants: {
            variant: {
                primary:
                    "text-white bg-blue-700 hover:bg-blue-800 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800",
                secondary:
                    "text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700",
                success:
                    "text-white bg-green-700 hover:bg-green-800 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800",
                danger:
                    "text-white bg-red-700 hover:bg-red-800 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900",
                warning:
                    "text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-yellow-300 dark:focus:ring-yellow-900",
            },
            size: {
                xs: "px-3 py-2 text-xs",
                sm: "px-3 py-2 text-sm",
                md: "px-5 py-2.5 text-sm",
                lg: "px-5 py-3 text-base",
                xl: "px-6 py-3.5 text-base",
            },
        },
        defaultVariants: {
            variant: "primary",
            size: "md",
        },
    }
);

export type ButtonVariant = VariantProps<typeof buttonVariants>["variant"];

export type IKuButtonProps = IFormButton &
    VariantProps<typeof buttonVariants> & {
        customClass?: string;
        onClick?: () => void;
        children?: React.ReactNode;
        href?: string;
        loading?: boolean;
    };