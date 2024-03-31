import useEditTableViewModel from "../../../../viewmodels/Editor/EditTableViewModel";
import Button from "../../../../components/Base/Button/Button";
import Select from "../../../../components/Base/Select/Select";
import Option from "../../../../components/Base/Option/Option";
import Input from "../../../../components/Base/Input/Input";
import {RelationType} from "../../../../models/db/db.types";

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
                  <Select name="columnId" defaultValue={r.columnId} onChange={onUpdate}>
                    {table?.columns?.map(c => {
                      return (
                        <Option value={c.id}>{c.name}</Option>
                      )
                    })}
                  </Select>
                </td>
                <td>
                  <Select name="type" defaultValue={r.type} onChange={onUpdate}>
                    {Object.entries(RelationType).map(([key, value]) => {
                      return (
                        <Option value={value}>{key}</Option>
                      )
                    })}
                  </Select>
                </td>
                <td>
                  <Select name="referenceTableId" defaultValue={r.referenceColumnId} onChange={onUpdate}>
                    {referenceTables?.map(t => {
                      return (
                        <Option value={t.id}>{t.name}</Option>
                      )
                    })}
                  </Select>
                </td>
                <td>
                  <Select name="referenceColumnId" defaultValue={r.referenceTableId} onChange={onUpdate}>
                    {
                      r.referenceTableId
                        ? (() => {
                          const referenceTable  = referenceTables?.find(({id}) => id === r.referenceTableId);

                          if (!referenceTable) return;

                          return referenceTable.columns.map(c => {
                            return (
                              <Option value={c.id}>{c.name}</Option>
                            )
                          })
                        })()
                        : null
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
}

export default TableRelationsTab;