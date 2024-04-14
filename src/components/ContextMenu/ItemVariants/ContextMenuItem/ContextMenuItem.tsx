import './ContextMenuItem.style.css';
import {ContextMenuElementProps} from "./ContextMenuItem.types";

function ContextMenuItem(props: Omit<ContextMenuElementProps & { type: 'menuItem' }, 'type'>) {
  const _onClick = props.disabled
    ? undefined
    : props.onClick;

  const className = ['context-menu__item'];

  if (props.disabled) {
    className.push('context-menu__item_disabled');
  }

  return (
    <div className={className.join(' ')} onClick={_onClick}>
      {props.name}
    </div>
  )
}

export default ContextMenuItem;