export interface IKuModalProps {
    id?: string;
    testId?: string;
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