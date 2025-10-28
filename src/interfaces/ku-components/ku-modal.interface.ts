export interface IKuModalProps {
    show: boolean;
    children: React.ReactNode;
    title?: string;
    onClose?: () => void;
    onSubmit?: () => void;
    onCancel?: () => void;
    onDelete?: () => void;
    onEdit?: () => void;
    onView?: () => void;
}