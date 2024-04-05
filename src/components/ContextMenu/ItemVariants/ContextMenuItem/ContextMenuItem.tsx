import './ContextMenuItem.style.css';
import {ContextMenuItemProps} from "./ContextMenuItem.types";

function ContextMenuItem(props: Omit<ContextMenuItemProps & { type: 'menuItem' }, 'type'>) {
  return (
    <div className="context-menu__item" onClick={props.onClick}>
      {props.name}
    </div>
  )
}

export default ContextMenuItem;