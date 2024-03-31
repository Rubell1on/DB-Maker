import {Table} from "../../../models/db/db.types";
import {createContext, MouseEvent, useEffect} from "react";
import './EditTableModal.css'
import {ModalBaseProps} from "../../../shared/ModalBaseProps";
import {Props} from "../../../shared/Props";
import './EditorModal.css'
import ModalWindow from "../../../components/ModalWindow/ModalWindow";
import {NavLink, Outlet, useParams} from "react-router-dom";
import Button from "../../../components/Base/Button/Button";
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

  return (
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
  )

  function onSubmitTable(e: MouseEvent<HTMLFormElement, globalThis.MouseEvent>) {
    e.preventDefault();

    const { table} = editTableViewModel;

    if (!table) return;

    props.onSubmit(table);
  }
}

export default EditTableModal