import {ContextMenuItemProps} from "./ContextMenuItem/ContextMenuItem.types";
import ContextMenuItem from "./ContextMenuItem/ContextMenuItem";
import ContextMenuSeparator from "./ContextMenuSeparator/ContextMenuSeparator";
import ContextMenuList from "./ContextMenuContainer/ContextMenuList";

function createContextMenuItem(item: ContextMenuItemProps) {
  switch (item.type) {
    case 'item': {
      return <ContextMenuItem name={item?.name} onClick={item?.onClick}/>
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