import './ContextMenu.style.css';
import {MouseEvent, useState} from "react";
import {Vector2} from "../../shared/Vector2";
import {ContextMenuElementProps} from "./ItemVariants/ContextMenuItem/ContextMenuItem.types";
import createContextMenuItem from "./ItemVariants/contextMenuItem.factory";

type ContextMenuProps = {
  children?: any,
  contextItems?: ContextMenuElementProps[]
  contextMenuPositionOffset?: Vector2,
  openMenuMouseButton: 'LMB' | 'RMB'
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

  // function onAppClick(e: globalThis.MouseEvent) {
  //   console.log('onAppClick')
  //   if (!isOpenned) return;
  //
  //   setIsOpenned(false);
  // }

  const [isOpenned, setIsOpenned] = useState(false);
  const [menuPosition, setMenuPosition] = useState(new Vector2());

  const bodyStyle = props.position === 'fixed'
    ? {}
    : {transform: `translate(${menuPosition.x}px, ${menuPosition.y}px)`}
  const bodyClassName = ['context-menu__body'];

  if (props.position === 'fixed') {
    bodyClassName.push('context-menu__body_fixed');
  }

  const _onContextMenu = props.openMenuMouseButton === 'LMB'
    ? onClick
    : onContextMenu;

  const _onClick = props.openMenuMouseButton === 'LMB'
    ? onContextMenu
    : onClick;

  return (
    <div onContextMenu={_onContextMenu} onClick={_onClick} className="context-menu__wrapper">
      <>
        {children}
        {
          isOpenned
            ? <>
              <div className="context-menu__background" onClick={onClick} onContextMenu={onClick}></div>
              <div
                className={bodyClassName.join(' ')}
                style={bodyStyle}>
                {contextItems?.map(createContextMenuItem)}
              </div>
            </>
            : null
        }
      </>
    </div>
  )
  function onClick(e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) {
    e.stopPropagation();
    e.preventDefault();

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