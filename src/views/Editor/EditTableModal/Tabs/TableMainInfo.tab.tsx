import Label from "../../../../components/Base/Label/Label";
import Input from "../../../../components/Base/Input/Input";
import {Table} from "../../../../models/db/db.types";
import {ChangeEventHandler, useContext} from "react";
import {EditTableModalTabContext} from "../EditTableModal";
import useEditTableViewModel from "../../../../viewmodels/Editor/EditTableViewModel";

interface MainInfoTabProps {
  // table?: Table;
  // onChange?: ChangeEventHandler<HTMLInputElement | HTMLSelectElement>;
  editTableViewModel: ReturnType<typeof useEditTableViewModel>
}

function TableMainInfoTab({editTableViewModel}: MainInfoTabProps) {
  // const context = useContext(EditTableModalContext)!;
  //
  // const {
  //   editTableViewModel
  // } = context;

  const {table, onUpdateTableField} = editTableViewModel;

  return (
    <>
      <Label htmlFor="table-name" title="Наименование таблицы"/>
      <Input type="text" id="table-name" name="name" required={true} className="table-editor__name"
             defaultValue={table?.name} onChange={(e) => {
        onUpdateTableField(e);
        console.log('TableMainInfoTab.onChange', e)
      }}/>
    </>
  )
}

export default TableMainInfoTab