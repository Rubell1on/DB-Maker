// import {createContext, MouseEvent} from "react";
// import ContextMenu from "./ContextMenu";
//
// type ContextMenuWrapperProps = {children: typeof ContextMenu[]};
// export const MenuContext = createContext(undefined);
// function ContextMenuWrapper(props: ContextMenuWrapperProps) {
//   const onClickEvent = new EventSource('CONTEXT_MENU_CLICK_SOURCE');
//   return (
//     <MenuContext.Provider value={}>
//       <div className="context-menu_wrapper" >
//         {props.children}
//       </div>
//     </MenuContext.Provider>
//   )
//
//   function onClick(e: MouseEvent<HTMLDivElement, globalThis.HTMLDivElement>) {
//     onClickEvent.dispatchEvent()
//   }
// }
//
// export default ContextMenuWrapper;