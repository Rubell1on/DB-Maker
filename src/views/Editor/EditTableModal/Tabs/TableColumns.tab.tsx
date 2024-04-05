import React from "react";
import useEditTableViewModel from "../../../../viewmodels/Editor/EditTableViewModel";
import {ColumnType} from "../../../../models/db/db.types";
import Input from "../../../../components/Base/Input/Input";
import Select from "../../../../components/Base/Select/Select";
import Option from "../../../../components/Base/Option/Option";
import Button from "../../../../components/Base/Button/Button";

interface TableColumnsTabProps {
  // table?: Table;
  // onChange?: ChangeEventHandler<HTMLInputElement | HTMLSelectElement>;
  editTableViewModel: ReturnType<typeof useEditTableViewModel>
}

function TableColumnsTab({editTableViewModel}: TableColumnsTabProps) {
  const {
    table,
    addColumn,
    updateColumn,
    deleteColumn
  } = editTableViewModel;

  return (
    <>
      {table?.columns.length
        ? <table>
          <thead>
          <tr>
            <th></th>
            <th>Нименование колонки</th>
            <th>Первичный ключ</th>
            <th>Тип</th>
            {/*<th>Внешний ключ</th>*/}
          </tr>
          </thead>
          <tbody>
          {
            table?.columns.map((c, i) => {
              const onChange = updateColumn(c.id);
              return <tr key={`name_${i}`} className="columns__column">
                <td>
                  <Button type="button" className="column__delete" style={{padding: 0, width: "28px"}} value="-"
                          onClick={() => deleteColumn(c.id)}/>
                </td>
                <td>
                  <Input type="text" name="name" className="column__name"
                         defaultValue={c.name}
                         onChange={onChange}/>
                </td>
                <td>
                  <Input type="checkbox" name="isPrimaryKey" className="column__primary"
                         defaultChecked={c.isPrimaryKey} onChange={onChange}/>
                </td>
                <td>
                  <Select className="column__type" name="type" defaultValue={c.type} onChange={onChange}
                          required={true}>
                    {
                      getColumnTypes().map(([key, value], i) => {
                        return <Option key={`type_option_${i}`} value={value}>{key}</Option>
                      })
                    }
                  </Select>
                </td>
                {/*<td>*/}
                {/*  <input type="button" className="column__edit-relation" value={c.relation ? "*" : "+"}*/}
                {/*         onClick={setRelationData(c)}/>*/}
                {/*  {*/}
                {/*    c.relation*/}
                {/*      ? <input type="button" className="column__edit-relation" value="-"*/}
                {/*               onClick={() => onRelationDelete(c.id)}/>*/}
                {/*      : null*/}
                {/*  }*/}
                {/*</td>*/}
              </tr>
            })
          }
          </tbody>
        </table>
        : <div>Нет колонок</div>
      }
      <div className="column__controls">
        <Button type="button" className="table-editor__add-column" onClick={addColumn} value="Добавить колонку"/>
      </div>
    </>
  )

  function getColumnTypes(): [key: string, value: string][] {
    return [
      ['', ''],
      ...Object.entries(ColumnType)
    ]
  }
}

export default TableColumnsTab;