import './ContextMenu.style.css';
import {MouseEvent, /*useEffect,*/ useState} from "react";
import {Vector2} from "../../shared/Vector2";
import {ContextMenuItemProps} from "./ItemVariants/ContextMenuItem/ContextMenuItem.types";
import createContextMenuItem from "./ItemVariants/contextMenuItem.factory";

type ContextMenuProps = {
  children?: any,
  contextItems?: ContextMenuItemProps[]
  contextMenuPositionOffset?: Vector2,
  position: 'fixed' | 'dynamic'
}

function ContextMenu(props: ContextMenuProps) {
  const {
    children,
    contextItems,
    contextMenuPositionOffset
  } = props;

  // useEffect(() => {
  //   console.log('ContextMenu.useEffect.enter');
  //   const app = document.getElementById('app')!;
  //
  //   app.addEventListener('click', onAppClick);
  //
  //   return () => {
  //     console.log('ContextMenu.useEffect.return');
  //     app.removeEventListener('click', onAppClick);
  //   }
  // }, []);

  // function onAppClick() {
  //   console.log('onAppClick')
  //   // if (!isOpenned) return;
  //
  //   setIsOpenned(false);
  // }

  const [isOpenned, setIsOpenned] = useState(false);
  const [menuPosition, setMenuPosition] = useState(new Vector2());
  const bodyStyle = props.position === 'fixed'
    ? {}
    : {transform: `translate(${menuPosition.x}px, ${menuPosition.y}px)`}

  return (
    <div onContextMenu={onContextMenu} onClick={onClick} className="context-menu__wrapper">
      <>
        {children}
        {
          isOpenned
            ? <div
              className="context-menu__body"
              style={bodyStyle}>
              {contextItems?.map(createContextMenuItem)}
            </div>
            : null
        }
      </>
    </div>
  )

  function onClick() {
    if (!isOpenned) return;

    setIsOpenned(false);
  }

  function onContextMenu(e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) {
    e.preventDefault();
    e.stopPropagation();

    const position = new Vector2();
    position.x = e.clientX;
    position.y = e.clientY;

    if (contextMenuPositionOffset) {
      position.x = position.x + contextMenuPositionOffset.x;
      position.y = position.y + contextMenuPositionOffset.y;
    }

    setMenuPosition(position);
    setIsOpenned(true);
    console.log("Context Menu");
  }
}

export default ContextMenu;