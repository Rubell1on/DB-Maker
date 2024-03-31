import {Table} from "../../../models/db/db.types";
import {ChangeEvent, createContext, MouseEvent, useCallback, useContext, useEffect, useState} from "react";
import './EditTableModal.css'
import {Column, ColumnType, Relation} from "../../../shared/Column";
import {ModalBaseProps} from "../../../shared/ModalBaseProps";
import {Props} from "../../../shared/Props";
import RelationEditorModal from "./RelationEditorModal";
import {DbContext} from "../EditorView";
import './EditorModal.css'
import ModalWindow from "../../../components/ModalWindow/ModalWindow";
import {NavLink, Outlet, Route, Routes, useLocation, useNavigate, useParams} from "react-router-dom";
import Button from "../../../components/Base/Button/Button";
import Label from "../../../components/Base/Label/Label";
import Input from "../../../components/Base/Input/Input";
import TableMainInfoTab from "./Tabs/TableMainInfo.tab";
import useEditTableViewModel from "../../../viewmodels/Editor/EditTableViewModel";

type EditTableModalContextType = {
  editTableViewModel: ReturnType<typeof useEditTableViewModel>
} | null
export const EditTableModalTabContext = createContext<EditTableModalContextType>(null);

function EditTableModal({props}: Props<ModalBaseProps<Table>>) {
  const params = useParams();
  const {tableId} = params;
  console.log('EditTableModal', params);

  const editTableViewModel = useEditTableViewModel();

  useEffect(() => {
    editTableViewModel.setTableId(tableId!);
  });

  const [selectedColumn, setSelectedColumn] = useState<Column | null>(null);
  // const [editingRelation, setEditingRelation] = useState(false);

  const location = useLocation();

  return (
    // table ?
    // <Routes location={location}>
    //   <Route path="table/:tableId" element={
    <ModalWindow title="Редактирование таблицы" onClose={props?.onCancel}>
      <form className="table-editor__wrapper" onSubmit={onSubmitTable}>
        <div className="wrapper__navigation">
          <div className="navigation__links">
            <NavLink className="navigation__link" to="main">Основная информация</NavLink>
            <NavLink className="navigation__link" to="columns">Колонки</NavLink>
            <NavLink className="navigation__link" to="relations">Внешние ключи</NavLink>
          </div>
          <div className="navigation__body">
            <EditTableModalTabContext.Provider value={{editTableViewModel}}>
              <Outlet/>
            </EditTableModalTabContext.Provider>
          </div>
        </div>
        <div className="wrapper__controls">
          <Button type="submit" value="Сохранить"/>
          <Button type="button" value="Отмена" onClick={props.onCancel}/>
        </div>
      </form>
    </ModalWindow>
    // }>
    // <Route path="main" element={
    //   <TableMainInfoTab table={table!} onChange={onUpdateTable}/>
    // }/>
    //    <Route path="columns" element={<div>columns</div>}/>
    //    <Route path="relations" element={<div>relations</div>}/>
    //  </Route>
    // </Routes>
    //  : null
    // <ModalWindow title="Редактировать таблицу">
    //   <>
    //     {
    //       editingRelation
    //         ? <RelationEditorModal props={{
    //           relation: selectedColumn?.relation || null,
    //           tables: dbContext?.tables || [],
    //           onCancel: () => setEditingRelation(false),
    //           onSubmit: onSubmitRelation
    //         }}/>
    //         : null
    //     }
    //     <form className="editor-modal table-editor" onSubmit={onSubmitTable}>
    //       <label htmlFor="table-name">Наименование таблицы</label>
    //       <input type="text" id="table-name" name="name" required={true} className="table-editor__name"
    //              defaultValue={table.name}
    //              onChange={onUpdateTable}/>
    //
    //       <div className="table-editor__columns">
    //         <h4 className="className columns__header">Колонки</h4>
    //         {table.columns.length
    //           ? <table>
    //             <thead>
    //             <tr>
    //               <th></th>
    //               <th>Нименование колонки</th>
    //               <th>Первичный ключ</th>
    //               <th>Тип</th>
    //               <th>Внешний ключ</th>
    //             </tr>
    //             </thead>
    //             <tbody>
    //             {
    //               table.columns.map((c, i) => {
    //                 const onChange = onUpdateColumn(c.id);
    //                 return <tr key={`name_${i}`} className="columns__column">
    //                   <td>
    //                     <input type="button" className="column__delete" value="-" onClick={deleteColumn(c.id)}/>
    //                   </td>
    //                   <td>
    //                     <input type="text" name="name" className="column__name"
    //                            defaultValue={c.name}
    //                            onChange={onChange}/>
    //                   </td>
    //                   <td>
    //                     <input type="checkbox" name="isPrimaryKey" className="column__primary"
    //                            defaultChecked={c.isPrimaryKey} onChange={onChange}/>
    //                   </td>
    //                   <td>
    //                     <select className="column__type" name="type" defaultValue={c.type}
    //                             onChange={onChange}>
    //                       {
    //                         Object.entries(ColumnType).map(([key, value], i) => {
    //                           return <option key={`type_option_${i}`}
    //                                          value={value}>{key}</option>
    //                         })
    //                       }
    //                     </select>
    //                   </td>
    //                   <td>
    //                     <input type="button" className="column__edit-relation" value={c.relation ? "*" : "+"}
    //                            onClick={setRelationData(c)}/>
    //                     {
    //                       c.relation
    //                         ? <input type="button" className="column__edit-relation" value="-"
    //                                  onClick={() => onRelationDelete(c.id)}/>
    //                         : null
    //                     }
    //                   </td>
    //                 </tr>
    //               })
    //             }
    //             </tbody>
    //           </table>
    //           : null
    //         }
    //         <input type="button" className="table-editor__add-column" onClick={onAddColumn} value="Добавить колонку"/>
    //       </div>
    //
    //       <input type="submit" className="table-editor__submit" value="Сохранить"/>
    //       <input type="button" className="table-editor__cancel" onClick={props.onCancel} value="Отмена"/>
    //     </form>
    //   </>
    // </ModalWindow>
  )

  // function onRelationDelete(columnId: number) {
  //   const columns = table.columns.map(c => {
  //     return c.id === columnId ? {...c, relation: null} : c;
  //   })
  //   setTable({...table, columns})
  // }

  function onSubmitTable(e: MouseEvent<HTMLFormElement, globalThis.MouseEvent>) {
    e.preventDefault();

    const { table} = editTableViewModel;

    if (!table) return;

    props.onSubmit(table);
  }

  function setRelationData(column: Column) {
    return () => {
      setSelectedColumn(column);
      setEditingRelation(true);
    }
  }

  function onSubmitRelation(data: Relation) {
    const columns: Column[] = table.columns.map(c => {
      return c.id === selectedColumn?.id! ? {...selectedColumn!, relation: data} : c
    });

    setTable({...table, columns});
    setEditingRelation(false);
  }
}

export default EditTableModal