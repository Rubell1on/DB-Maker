import {UseEditorViewModelArgs} from "./EditorViewModel.types";
import {Table as TableDTO, Table} from "../../models/db/db.types";
import uuid from "react-uuid";
import {Vector2} from "../../shared/Vector2";
import {MouseEvent, useEffect, useState} from "react";
import {DB} from "../../models/db/db.types";
import table from "../../components/table/Table";
import useDBModel from "../../models/db/db.model";
import useMouseDrag from "../../hooks/useMouseDrag";
import {useNavigate} from "react-router-dom";

function useEditorViewModel(dbModel: ReturnType<typeof useDBModel>) {
  const [currentDbId, setCurrentDbId] = useState<string>();
  const [currentDb, setCurrentDb] = useState<DB | null>(null);
  const mouseDrag = useMouseDrag();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentDbId?.length) {
      return;
    }

    const db = dbModel.dbs.find(({id: dbId}) => dbId === currentDbId);

    if (!db) {
      console.error(`База данных с id: ${currentDbId} не найдена`);
      return;
    }

    setCurrentDb(db)
  }, [currentDbId, dbModel.dbs]);

  const [selectedTables, setSelectedTables] = useState<TableDTO[]>([]);
  const [editingTable, setEditingTable] = useState(false);


  function createTable() {
    const tables = [
      ...currentDb.tables, {
        id: uuid(),
        name: 'Таблица',
        position: new Vector2(),
        columns: [],
        relations: []
      }
    ];

    dbModel.updateDb(currentDbId, {tables})
  }

  function _updateTable(id: string, table: Partial<Omit<Table, 'id'>>) {
    const tables = currentDb!.tables.map(t => {
      return t.id === id ? {...t, ...table} : t;
    });

    dbModel.updateDb(currentDbId!, {tables})
  }

  function deleteTable(id: string) {
    const tables = currentDb!.tables.filter(({id: tableId}) => tableId !== id)
    dbModel.updateDb(currentDbId!, {tables})
  }

  function onEditTableClick(tableId: string) {
    return (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
      setSelectedTables(currentDb!.tables.filter(({id}) => id === tableId))
      setEditingTable(true);
    }
  }

  function onCancelTableEdit() {
    navigate(`/editor/${currentDbId}`)
  }

  function onUpdateTable(id: string, table: Partial<Omit<Table, 'id'>>) {
    _updateTable(id, table);
  }

  function onHeaderMouseDown(tableId: string) {
    return (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
      mouseDrag.onMouseDown(e);

      const table = currentDb!.tables.find(({id}) => id === tableId);

      if (!table) {
        console.error(`onHeaderMouseDown: Таблица с id: ${tableId} не найдена`);
        return;
      }

      setSelectedTables([table]);
    }
  }

  function onHeaderMouseUp(e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) {
    mouseDrag.onMouseUp(e);
    setSelectedTables([]);
  }

  function onHeaderMouseMove(e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) {
    if(!mouseDrag.isDragging) return;

    mouseDrag.onMouseMove(e);

    if (!selectedTables.length) return;

    const selectedTableIds = selectedTables.map(({id}) => id);

    const tables = currentDb!.tables.map(t => {
      if (selectedTableIds.includes(t.id)) {
        const position = {
          x: t.position.x + mouseDrag.diff.x,
          y: t.position.y + mouseDrag.diff.y
        }

        console.log('onHeaderMouseMove', t.position, mouseDrag.diff)

        return {...t, position};
      }

      return t;
    }, [] as TableDTO[]);

    dbModel.updateDb(currentDbId!, { tables })
  }

  return {
    setCurrentDbId,
    currentDb,
    createTable,
    deleteTable,
    selectedTables,
    editingTable,
    onUpdateTable,
    onEditTableClick,
    onCancelTableEdit,
    tableHeaderMouseEvents: {
      onHeaderMouseDown,
      onHeaderMouseUp,
      onHeaderMouseMove
    }
  }
}

export default useEditorViewModel