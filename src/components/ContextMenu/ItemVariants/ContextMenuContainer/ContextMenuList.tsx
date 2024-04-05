import './ContextMenuContainer.style.css'
import {ContextMenuItemProps} from "../ContextMenuItem/ContextMenuItem.types";
import {useState} from "react";
import createContextMenuItem from "../contextMenuItem.factory";

function ContextMenuList(props: Omit<ContextMenuItemProps & { type: 'container' }, 'type'>) {
  const [hovered, setHover] = useState(false);
  return (
    <div className="context-menu__container" onMouseEnter={OnMouseEnter} onMouseLeave={OnMouseLeave}>
      <div className="context-container__name">
        <div>{props.name}</div>
        <div>{'>'}</div>
      </div>
      {
        props?.children && hovered
          ? <div className="context-container__wrapper">
            {
              props.children.map(item => {
                return createContextMenuItem(item);
              })
            }
          </div>
          : null
      }
    </div>
  )

  function OnMouseEnter(e) {
    setHover(true);
  }

  function OnMouseLeave() {
    setHover(false);
  }
}

export default ContextMenuList;