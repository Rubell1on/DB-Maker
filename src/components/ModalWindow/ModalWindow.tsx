import './ModalWindow.css'

interface ModalWindowProps {
    title?: string,
    children: string | JSX.Element | JSX.Element[][]
    onClose?: () => void
}
function ModalWindow(props: ModalWindowProps) {
    return (
        <>
            <div className="modal-background" onClick={props?.onClose}></div>
            <div className="modal-window">
                <div className="modal-window__header">
                    <div className="header__title">{props?.title}</div>
                </div>
                <div className="modal-window__body">
                    {props?.children}
                </div>
            </div>
        </>
    )
}

export default ModalWindow