import {ChangeEvent, useContext, useEffect, useState} from "react";
import {Column, ColumnType, Relation, RelationType, Table} from "../../models/db/db.types";
import {DbContext} from "../../views/Editor/EditorView";
import uuid from "react-uuid";

function useEditTableViewModel() {
  const dbContext = useContext(DbContext);
  // const editTableContext
  const [tableId, setTableId] = useState('')
  const [table, setTable] = useState<Table | null>(null);
  const [referenceTables, setReferenceTables] = useState<Table[]>([]);

  useEffect(() => {
    console.log('useEditTableViewModel.useEffect', dbContext, tableId || null);
    // const { tableId } = params;

    if (!tableId) {
      return;
    }

    // setTableId(tableId);

    const _table = dbContext?.tables.find(({id}) => id === tableId);
    if (!_table) {
      console.error(`Таблица с id: ${tableId} не найдена`);
      return;
    }

    setTable(_table);
    setReferenceTables(dbContext?.tables?.filter(({columns}) => columns?.length) || []);
  }, [dbContext, tableId]);

  function onUpdateTableField(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    if (!table) return;

    const {name, value} = e.target;

    setTable({...table, [name]: value});
  }

  function addColumn() {
    if (!table) return;

    const {columns} = table;

    const newColumn: Column = {
      id: uuid(),
      name: 'Колонка',
      type: ColumnType.Int,
      sort: columns.length + 1,
      isPrimaryKey: false,
    }
    setTable({...table, columns: [...table.columns, newColumn]})
  }

  function updateColumn(columnId: string) {
    return (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const {name, value} = e.target;

      if (!table) return;

      const columns = table.columns.map(c => {
        if (c.id !== columnId) return c;

        let targetValue: string | boolean = value;

        if (name === 'isPrimaryKey') {
          targetValue = !c.isPrimaryKey
        }

        return {
          ...c,
          [name]: targetValue
        };
      })

      setTable({...table, columns});
    }
  }

  function deleteColumn(columnId: string) {
    if (!table) return;

    const columns = table.columns.filter(({id}) => id !== columnId)
    setTable({...table, columns})
  }

  function addRelation() {
    if (!table) return;

    const relation: Relation = {
      id: uuid(),
      columnId: '',
      foreignKeyName: `${table.name}_fk`,
      type: RelationType.OneToOne,
      referenceTableId: '',
      referenceColumnId: ''
    }

    const relations = [...table.relations, relation];

    setTable({...table, relations})
  }

  function updateRelation(relationId: string) {
    return (e: any) => {
      const {
        name,
        value
      } = (e.target) as HTMLInputElement;

      // switch (name) {
      //   case 'referenceColumnId': {
      //
      //     break;
      //   }
      // }

      if (!table) return;

      const relations = table.relations.map(r => {
        return r.id === relationId ? {...r, [name]: value} : r;
      })

      setTable({...table, relations});
    }
  }

  function deleteRelation(relationId: string) {
    if (!table) return;

    const relations = table?.relations?.filter(({id}) => id !== relationId)

    setTable({...table, relations})
  }

  return {
    table,
    referenceTables,
    setTableId,
    onUpdateTableField,

    addColumn,
    updateColumn,
    deleteColumn,

    addRelation,
    updateRelation,
    deleteRelation
  }
}

export default useEditTableViewModel