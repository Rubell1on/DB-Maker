import './ModalWindow.css'
import Header from "../Base/Header/Header";

interface ModalWindowProps {
  title?: string;
  className?: string | string[];
  children: string | JSX.Element | JSX.Element[][];
  onClose?: () => void;
}

function ModalWindow(props: ModalWindowProps) {
  return (
    <>
      <div className="modal-background"></div>
      <div className="modal-window">
        <div className="modal-window__header">
          <Header class="header__title" title={props?.title}/>
          <button className="header__close" onClick={props?.onClose}>
            <div className="header__close-cross">+</div>
          </button>
        </div>
        <div className="modal-window__body">
          {props?.children}
        </div>
      </div>
    </>
  )
}

export default ModalWindow