import './Table.css'
import {Table as TableDTO} from "../../models/db/db.types";
import {MouseEvent} from "react";
import {Props as _Props} from "../../shared/Props";
import useDoubleClick from "../../hooks/useDoubleClick";

type TableProps = _Props<TableDTO> & {
  onEditTableClick: (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void;
  onDelete: () => void;
  headerMouseEvents: {
    onMouseDown: (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => void;
    onMouseUp: (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => void;
    onMouseMove: (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => void;
  }
}

function Table({
                 props,
                 onEditTableClick,
                 onDelete,
                 headerMouseEvents
               }: TableProps) {
  const doubleClick = useDoubleClick(onEditTableClick);

  return (
    <div
      id={`table_${props.id}`}
      className="table"
      style={{transform: `translate(${props.position.x}px, ${props.position.y}px)`}}
      onClick={doubleClick.onClick}
    >
      <div className="table__header" onMouseDown={headerMouseEvents.onMouseDown}>
        <div className="header__name">{props.name}</div>
        <div className="header__controls">
          <button className="header__settings" onClick={onEditTableClick}>*</button>
          <button className="header__delete" onClick={onDelete}>-</button>
        </div>
      </div>
      <div className="table__wrapper">
        <table className="table__body">
          <tbody>
          {
            props.columns.map(c => {
              return <tr className="body__column">
                <td className="column__pk">{c.isPrimaryKey ? 'PK' : ''}</td>
                <td className="column__name">{c.name}</td>
                <td className="column__type">{c.type}</td>
              </tr>
            })
          }
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Table