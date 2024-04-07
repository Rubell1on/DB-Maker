import useEditTableViewModel from "../../../../viewmodels/Editor/EditTableViewModel";
import Button from "../../../../components/Base/Button/Button";
import Select from "../../../../components/Base/Select/Select";
import Option from "../../../../components/Base/Option/Option";
import Input from "../../../../components/Base/Input/Input";
import {Column, RelationType, Table} from "../../../../models/db/db.types";

interface TableRealationsTabProps {
  editTableViewModel: ReturnType<typeof useEditTableViewModel>
}

function TableRelationsTab({editTableViewModel}: TableRealationsTabProps) {
  const {
    table,
    referenceTables,
    addRelation,
    updateRelation,
    deleteRelation
  } = editTableViewModel;

  return (
    <>
      {
        table?.relations?.length
          ? <table>
            <thead>
            <tr>
              <th></th>
              <th>Наименование</th>
              <th>Колонка</th>
              <th>Связь</th>
              <th>Таблица</th>
              <th>Колонка</th>
            </tr>
            </thead>
            <tbody>
            {table?.relations?.map(r => {
              const onUpdate = updateRelation(r.id);
              return (<tr>
                <td>
                  <Button type="button" value="-" onClick={() => deleteRelation(r.id)}/>
                </td>
                <td>
                  <Input type="text" defaultValue={r.foreignKeyName} onChange={onUpdate}/>
                </td>
                <td>
                  <Select name="columnId" defaultValue={r.columnId} onChange={onUpdate} required={true}>
                    {
                      getColumns(table?.columns).map(c => {
                        return (
                          <Option value={c.id}>{c.name}</Option>
                        )
                      })
                    }
                  </Select>
                </td>
                <td>
                  <Select name="type" defaultValue={r.type} onChange={onUpdate} required={true}>
                    {getRelationTypes().map(([key, value]) => {
                      return (
                        <Option value={value}>{key}</Option>
                      )
                    })}
                  </Select>
                </td>
                <td>
                  <Select name="referenceTableId" defaultValue={r.referenceTableId} onChange={onUpdate} required={true}>
                    {getReferenceTables(referenceTables)?.map(t => {
                      return (
                        <Option value={t.id}>{t.name}</Option>
                      )
                    })}
                  </Select>
                </td>
                <td>
                  <Select name="referenceColumnId" defaultValue={r.referenceColumnId} onChange={onUpdate} required={true}>
                    {
                      getReferenceColumns(r.referenceTableId).map(c => {
                        return (
                          <Option value={c.id}>{c.name}</Option>
                        )
                      })
                    }
                  </Select>
                </td>
              </tr>)
            })}

            </tbody>
          </table>
          : <div>Нет внешних ключей</div>
      }
      <div className="relation__controls">
        <Button type="button" value="Добавить" onClick={addRelation}/>
      </div>
    </>
  )

  function getColumns(columns: Column[]): Pick<Column, 'id' | 'name'>[] {
    const result = [{id: '', name: ''}];

    columns?.forEach(({id, name}) => result.push({id, name}))

    return result;
  }

  function getRelationTypes(): [key: string, value: string][] {
    return [
      ['', 'Не выбрана'],
      ...Object.entries(RelationType)
    ];
  }

  function getReferenceTables(tables: Table[]): Pick<Table, 'id' | 'name'>[] {
    const _tables = [{id: '', name: ''}];

    tables?.forEach(({id, name}) => _tables.push({id, name}));

    return _tables
  }

  function getReferenceColumns(referenceTableId: string): Pick<Column, 'id' | 'name'>[] {

    if (!referenceTableId?.length) {
      return [];
    }

    const referenceTable = referenceTables?.find(({id}) => id === referenceTableId);

    if (!referenceTable) {
      return [];
    }

    let name: string = !referenceTable.columns.length ? 'Нет колонок' : 'Не выбрана';

    const columnsWithPrimaryKey = referenceTable.columns.filter(({isPrimaryKey}) => isPrimaryKey)
    if (!columnsWithPrimaryKey.length) {
      name = 'Нет колонок с первичным ключом'
    }

    const _columns = [{id: '', name}];

    referenceTable.columns?.forEach(({id, name, isPrimaryKey}) => {
      if (isPrimaryKey) {
        _columns.push({id, name});
      }
    });

    return _columns;
  }
}

export default TableRelationsTab;