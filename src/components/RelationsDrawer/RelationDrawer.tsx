import {useContext, useEffect, useState} from "react";
import {DbContext} from "../../views/Editor/EditorView";
import {Vector2} from "../../shared/Vector2";
import './RelationDrawer.style.css';

function RelationsDrawer() {
  const className = "space__svg";
  const db = useContext(DbContext)!;
  const [paths, setPaths] = useState<{ id: string, curve: string }[]>([]);

  useEffect(() => {
    if (!db) return;

    const relationSpaceRect = document.querySelector(`.${className}`)?.getBoundingClientRect();

    if (!relationSpaceRect) return;

    type TableData = {
      position: Vector2;
      size: Vector2;
    }

    const tables = new Map<string, TableData>();

    type ColumnData = {
      tableId: string,
      position: Vector2,
      height: number
    }

    const columns = new Map<string, ColumnData>();

    const relations: {
      id: string,
      columnId: string,
      referenceColumnId: string
    }[] = [];

    db.tables?.forEach(table => {
      const tableRect = document.getElementById(`table_${table.id}`)?.getBoundingClientRect();
      const size = new Vector2();

      size.x = tableRect?.width || 0;
      size.y = tableRect?.height || 0;

      tables.set(table.id, {
        position: table.position,
        size
      });

      table.columns.forEach(column => {
        const columnRect = document.getElementById(`table_column_${column.id}`)?.getBoundingClientRect();

        const position = new Vector2();

        position.x = columnRect?.left || 0;
        position.y = columnRect?.top || 0;

        columns.set(column.id, {
          tableId: table.id,
          position,
          height: columnRect?.height || 0
        })
      });

      table.relations.forEach(({id, columnId, referenceColumnId}) => {
        relations.push({
          id,
          columnId,
          referenceColumnId
        });
      });
    });

    const paths = relations.map(relation => {
      type RelationData = {
        table: TableData,
        column: ColumnData
      }
      let first: RelationData;
      let second: RelationData;

      const firstColumn = columns.get(relation.columnId)!;
      const firstTable = tables.get(firstColumn.tableId)!;

      const secondColumn = columns.get(relation.referenceColumnId)!;
      const secondTable = tables.get(secondColumn.tableId)!;

      if (firstTable.position.x > secondTable.position.x) {
        first = {
          table: secondTable,
          column: secondColumn
        }

        second = {
          table: firstTable,
          column: firstColumn
        }
      } else {
        first = {
          table: firstTable,
          column: firstColumn
        }

        second = {
          table: secondTable,
          column: secondColumn
        }
      }

      const startX = first.column.position.x + first.table.size.x - 9;
      const startY = first.column.position.y - relationSpaceRect.top + first.column.height / 2;

      const endX = second.column.position.x;
      const endY = second.column.position.y - relationSpaceRect.top + second.column.height / 2;

      const middleX = (startX + endX) / 2;
      const middleY = (startY + endY) / 2;

      const controlX = (middleX + startX) / 2;
      const _controlY = (middleY + startY) / 2;
      const controlY = _controlY + (startY - middleY) / 2;

      return {
        id: `rel_${relation.id}`,
        curve: `M${startX},${startY} Q${controlX},${controlY} ${middleX},${middleY} T${endX},${endY}`,
      }
    });

    setPaths(paths);
  }, [db]);

  return (
    <svg
      width="100%"
      height="100%"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fillRule="evenodd"
      clipRule="evenodd"
    >
      {paths?.map(p => (<path id={p.id} className="relation" d={p.curve}/>))}
    </svg>
  )
}

export default RelationsDrawer