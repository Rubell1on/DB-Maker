import './ContextMenuItem.style.css';
import {ContextMenuElementProps} from "./ContextMenuItem.types";

function ContextMenuItem(props: Omit<ContextMenuElementProps & { type: 'item' }, 'type'>) {
  const _onClick = props.disabled
    ? undefined
    : props.onClick;

  const className = ['context-menu__item'];

  if (props.disabled) {
    className.push('context-menu__item_disabled');
  }

  return (
    <div className={className.join(' ')} onClick={_onClick}>
      <div className="context-menu__item-name">{props.name}</div>
      {
        props?.hint?.length
          ? <div className="context-menu__item-hint">{props?.hint}</div>
          : null
      }
    </div>
  )
}

export default ContextMenuItem;