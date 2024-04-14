import './Editor.css'
import Table from "../../components/table/Table";
import {DB} from "../../models/db/db.types";
import {createContext, useEffect} from 'react'
import {EditorViewArgs} from "./EditorView.types";
import {Outlet, useNavigate, useParams} from "react-router-dom";
import useEditorViewModel from "../../viewmodels/Editor/EditorViewModel";
import ContextMenu from "../../components/ContextMenu/ContextMenu";
import RelationsDrawer from "../../components/RelationsDrawer/RelationDrawer";
import {SaveFileType} from "../../hooks/useFile";

export const DbContext = createContext<DB | null>(null);

export type EditorViewModelReturnType = ReturnType<typeof useEditorViewModel>

export type EditTableContextType = {
  onUpdateTable: EditorViewModelReturnType['onUpdateTable'],
  onCancelTableEdit: EditorViewModelReturnType['onCancelTableEdit'],
} | null;

export const EditTableModalContext = createContext<EditTableContextType>(null)

function EditorView({editorViewModel}: EditorViewArgs) {
  const {currentDbId} = useParams();

  useEffect(() => {
    if (!currentDbId) return;

    console.log('EditView.useEffect', currentDbId);
    editorViewModel.setCurrentDbId(currentDbId);
  })

  const {
    currentDb: db,
    createTable,
    deleteTable,
    onUpdateTable,
    onCancelTableEdit,
    onOpenDb,
    onSaveDb,
    tableHeaderMouseEvents,
    isAllowedToSaveFile
  } = editorViewModel;

  const navigate = useNavigate();

  return (
    <DbContext.Provider value={db}>
      <div className="editor">
        <div className="editor__contorls">
          <ContextMenu position="fixed" contextMenuMouseButton="LMB" contextItems={[{
            type: 'item',
            name: 'Открыть',
            onClick: async () => await onOpenDb()
          }, {
            type: 'item',
            name: 'Сохранить',
            disabled: isAllowedToSaveFile,
            onClick: async () => await onSaveDb(SaveFileType.Current)
          }, {
            type: 'item',
            name: 'Сохранить как',
            onClick: async () => await onSaveDb(SaveFileType.New)
          }, {
            type: 'list',
            name: 'Экспорт',
            children: [{
              type: 'item',
              name: 'В SQL',
              onClick: () => {}
            }]
          }]}>
            <div className="controls__file">Файл</div>
          </ContextMenu>
          {/*<button className="controls__open-db" onClick={onOpenDb}>Открыть</button>*/}
          {/*<button className="controls__save-db" onClick={onSaveDb}>Сохранить как</button>*/}
          {/*<button className="controls__add-table" onClick={createTable}>Добавить таблицу</button>*/}
        </div>
        <ContextMenu position="dynamic" contextMenuMouseButton="RMB" contextMenuPositionOffset={{x: 0, y: -40}} contextItems={[{
          type: 'item',
          name: 'Создать таблицу',
          onClick: createTable,
        }, {
          type: 'separator'
        }, {
          type: 'item',
          name: 'Добавить заметку',
          onClick: () => console.log('Заметка создана')
        }, {
          type: 'list',
          name: 'Экспорт',
          children: [{
            type: 'item',
            name: 'Sql'
          }, {
            type: 'item',
            name: 'Png'
          }]
        }]}>
          <div className="editor__space" onMouseUp={tableHeaderMouseEvents.onHeaderMouseUp}
               onMouseMove={tableHeaderMouseEvents.onHeaderMouseMove}>
            {db?.tables.map(t =>
              <ContextMenu position="dynamic" contextMenuMouseButton="RMB" contextMenuPositionOffset={{x: 0, y: -40}} contextItems={[{
                type: 'item',
                name: 'Удалить',
                onClick: () => deleteTable(t.id)
              }]}>
                <Table
                  key={`table_${t.id}`}
                  props={t}
                  onEditTableClick={((id) => () => navigate(`table/${id}/main`))(t.id)}
                  onDelete={() => deleteTable(t.id)}
                  headerMouseEvents={{
                    onMouseDown: tableHeaderMouseEvents.onHeaderMouseDown(t.id),
                    onMouseUp: tableHeaderMouseEvents.onHeaderMouseUp,
                    onMouseMove: tableHeaderMouseEvents.onHeaderMouseMove
                  }}
                />
              </ContextMenu>)}
            <RelationsDrawer />
          </div>
        </ContextMenu>
        <EditTableModalContext.Provider value={{
          onUpdateTable,
          onCancelTableEdit
        }}>
          <Outlet/>
        </EditTableModalContext.Provider>
      </div>
    </DbContext.Provider>
  )
}

export default EditorView;