import {Table as TableDTO, Table} from "../../models/db/db.types";
import uuid from "react-uuid";
import {Vector2} from "../../shared/Vector2";
import {MouseEvent, useEffect, useMemo, useState} from "react";
import {DB} from "../../models/db/db.types";
import useDBModel from "../../models/db/db.model";
import useMouseDrag from "../../hooks/useMouseDrag";
import {useNavigate} from "react-router-dom";
import {SaveFileType, useFile} from "../../hooks/useFile";

function useEditorViewModel(
  dbModel: ReturnType<typeof useDBModel>,
  fileHook: ReturnType<typeof useFile>
) {
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
  const isAllowedToSaveFile = useMemo(() => !fileHook.fileHandler, [fileHook.fileHandler]);


  function createTable() {
    const tables = [
      ...currentDb.tables, {
        id: uuid(),
        name: 'Таблица',
        description: '',
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
    return () => {
      setSelectedTables(currentDb!.tables.filter(({id}) => id === tableId))
      setEditingTable(true);
    }
  }

  function onCancelTableEdit() {
    navigate(`DB-Maker/editor/${currentDbId}`)
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

  async function onOpenDb() {
    const db = await fileHook.load();

    if (!db) {
      console.error(`Не удалось загрузить файл БД`);
      return;
    }

    dbModel.setDbs([db]);

    setCurrentDbId(db.id);
    navigate(`DB-Maker/editor/${db.id}`)
  }

  async function onSaveDb(type: SaveFileType) {
    const db = dbModel.dbs.find(({id}) => id === currentDbId);

    if (!db) {
      console.error(`Не удалось найти БД с id: ${currentDbId}`);
      return;
    }

    const isDbSaved = await fileHook.save(db, type);

    if (!isDbSaved) {
      console.error(`Не удалось сохранить БД с id: ${currentDbId} в файл`);
      return;
    }
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
    onOpenDb,
    onSaveDb,
    tableHeaderMouseEvents: {
      onHeaderMouseDown,
      onHeaderMouseUp,
      onHeaderMouseMove
    },
    isAllowedToSaveFile
  }
}

export default useEditorViewModel