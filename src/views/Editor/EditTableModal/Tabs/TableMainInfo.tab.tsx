import Label from "../../../../components/Base/Label/Label";
import Input from "../../../../components/Base/Input/Input";
import useEditTableViewModel from "../../../../viewmodels/Editor/EditTableViewModel";
import TextArea from "../../../../components/Base/TextArea/TextArea";

interface MainInfoTabProps {
  editTableViewModel: ReturnType<typeof useEditTableViewModel>
}

function TableMainInfoTab({editTableViewModel}: MainInfoTabProps) {
  const {table, onUpdateTableField} = editTableViewModel;

  return (
    <>
      <Label htmlFor="table-name" title="Наименование"/>
      <Input type="text" id="table-name" name="name" required={true} className="table-editor__name"
             defaultValue={table?.name} onChange={(e) => {
        onUpdateTableField(e);
        console.log('TableMainInfoTab.onChange', e)
      }}/>
      <Label htmlFor="table-description" title="Описание"/>
      <TextArea id="table-description" name="description" className="table-editor__description"
             defaultValue={table?.description} onChange={(e) => {
        onUpdateTableField(e);
      }}/>
    </>
  )
}

export default TableMainInfoTab