export interface ModalBaseProps<TSubmit> {
    onSubmit: (data: TSubmit) => void;
    onCancel: () => void;
}