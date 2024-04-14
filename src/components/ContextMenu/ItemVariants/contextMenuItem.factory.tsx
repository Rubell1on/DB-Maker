import {ContextMenuElementProps} from "./ContextMenuItem/ContextMenuItem.types";
import ContextMenuItem from "./ContextMenuItem/ContextMenuItem";
import ContextMenuSeparator from "./ContextMenuSeparator/ContextMenuSeparator";
import ContextMenuList from "./ContextMenuContainer/ContextMenuList";

function createContextMenuItem(item: ContextMenuElementProps) {
  switch (item.type) {
    case 'item': {
      return <ContextMenuItem name={item?.name} onClick={item?.onClick} disabled={item?.disabled}/>
    }

    case 'separator': {
      return <ContextMenuSeparator />
    }

    case 'list': {
      return <ContextMenuList name={item?.name} children={item?.children} />
    }
  }
}

export default createContextMenuItem;