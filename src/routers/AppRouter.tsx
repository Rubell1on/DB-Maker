import useDBModel from "../models/db/db.model";
import useMainMenuViewModel from "../viewmodels/MainMenu/MainMenuViewModel";
import useEditorViewModel from "../viewmodels/Editor/EditorViewModel";
import {Route, Routes} from "react-router-dom";
import MainMenuView from "../views/MainMenu/MainMenuView";
import EditorView, {EditTableModalContext} from "../views/Editor/EditorView";
import {EditTableModalTabContext} from "../views/Editor/EditTableModal/EditTableModal";
import React from "react";
import EditTableModal from "../views/Editor/EditTableModal/EditTableModal";
import TableMainInfoTab from "../views/Editor/EditTableModal/Tabs/TableMainInfo.tab";
import TableColumnsTab from "../views/Editor/EditTableModal/Tabs/TableColumns.tab";
import TableRelationsTab from "../views/Editor/EditTableModal/Tabs/TableRelationsTab";

function AppRouter() {
  const dbModel = useDBModel();
  let mainMenuViewModel = useMainMenuViewModel(dbModel);

  return (
    <Routes>
      <Route path="DB-Maker/" element={<MainMenuView mainMenuViewModel={mainMenuViewModel}/>}/>
      <Route path="DB-Maker/editor/:currentDbId" element={<EditorView editorViewModel={useEditorViewModel(dbModel)}/>}>
        {/*<Route path="table/:tableId/:tab" />*/}
        <Route path="table/:tableId" element={
          <EditTableModalContext.Consumer>{
            props => <EditTableModal props={{
              onCancel: props?.onCancelTableEdit!,
              onSubmit: ({id, ...table}) => {
                props?.onUpdateTable(id, table);
              }
            }}/>
          }</EditTableModalContext.Consumer>

        }>
          <Route path="main" element={
            <EditTableModalTabContext.Consumer>
              {(data) => <TableMainInfoTab editTableViewModel={data?.editTableViewModel!}/>}
            </EditTableModalTabContext.Consumer>
          }/>
          {/*<Route path="main" element={<TableMainInfoTab/>}/>*/}
          <Route path="columns" element={
            <EditTableModalTabContext.Consumer>
              {data => <TableColumnsTab editTableViewModel={data?.editTableViewModel!}/>}
            </EditTableModalTabContext.Consumer>

          }/>
          <Route path="relations" element={
            <EditTableModalTabContext.Consumer>
              {data => <TableRelationsTab editTableViewModel={data?.editTableViewModel!}/>}
            </EditTableModalTabContext.Consumer>
          }/>
        </Route>
      </Route>
    </Routes>
  )
}

export default AppRouter