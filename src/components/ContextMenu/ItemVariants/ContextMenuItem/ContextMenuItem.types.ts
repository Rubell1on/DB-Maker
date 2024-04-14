import {MouseEventHandler} from "react";

export interface ContextMenuItemProps {
  type: 'item';
  name: string;
  disabled?: boolean
  onClick?: MouseEventHandler<HTMLDivElement>;
}

export interface ContextMenuSeparatorProps {
  type: 'separator'
}

export interface ContextMenuListProps {
  type: 'list';
  name: string;
  children?: ContextMenuElementProps[];
}

export type ContextMenuElementProps = ContextMenuItemProps| ContextMenuSeparatorProps | ContextMenuListProps