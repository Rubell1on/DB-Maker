import './Table.css'
import {Table as TableProps} from "../../shared/Table";
import {MouseEvent, useEffect, useRef, useState} from "react";
import {Vector2} from "../../shared/Vector2";

type Props = TableProps & {
    onEditTableClick?: (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void;
    onPositionChange?: (position: { x: number, y: number }) => void;
    onDelete?: (tableId: number) => void;
}

function Table({id, name, columns, position, onEditTableClick, onPositionChange, onDelete}: Props) {
    const [cursorPosition, setCursorPosition] = useState<Vector2>({ x:0, y:0 })
    const [tablePosition, setTablePosition] = useState(position);
    const [draggable, setDraggable] = useState(false);

    return (
        <div
            className="table"
            style={{transform: `translate(${tablePosition.x}px, ${tablePosition.y}px)`}}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onMouseMove={onMouseMove}
        >
            <div className="table__header">
                <div className="header__name">{name}</div>
                <div className="header__controls">
                    <button className="header__settings" onClick={onEditTableClick}>*</button>
                    <button className="header__delete" onClick={() => onDelete!(id)}>-</button>
                </div>
            </div>
            <table className="table__body">
                <tbody>
                {
                    columns.map(c => {
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
    )

    function onMouseDown(e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) {
        setCursorPosition({
            x: e.clientX,
            y: e.clientY
        });
        setDraggable(true);
    }

    function onMouseMove(e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) {
        if (!draggable) return;

        const {
            clientX,
            clientY
        } = e;
        const x = clientX - cursorPosition.x;
        const y = clientY - cursorPosition.y;

        setCursorPosition({
            x: clientX,
            y: clientY
        })

        const position = {
            x: tablePosition.x + x,
            y: tablePosition.y + y
        };
        setTablePosition(position);

        if (onPositionChange) {
            onPositionChange(position)
        }
    }

    function onMouseUp(e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) {
        setDraggable(false);
    }
}

export default Table