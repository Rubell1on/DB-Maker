import {MouseEventHandler} from "react";

export type ContextMenuItemProps = {
  type: 'item';
  name: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
} | {
  type: 'separator'
} | {
  type: 'list';
  name: string;
  children?: ContextMenuItemProps[];
}