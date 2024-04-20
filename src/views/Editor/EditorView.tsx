import './Editor.css'
import Table from "../../components/table/Table";
import {DB} from "../../models/db/db.types";
import {createContext, useEffect, useRef} from 'react'
import {EditorViewArgs} from "./EditorView.types";
import {Outlet, useNavigate, useParams} from "react-router-dom";
import useEditorViewModel from "../../viewmodels/Editor/EditorViewModel";
import ContextMenu from "../../components/ContextMenu/ContextMenu";
import RelationsDrawer from "../../components/RelationsDrawer/RelationDrawer";
import {SaveFileType} from "../../hooks/useFile";
import {Vector2} from "../../shared/Vector2";

export const DbContext = createContext<DB | null>(null);

export type EditorViewModelReturnType = ReturnType<typeof useEditorViewModel>

export type EditTableContextType = {
  onUpdateTable: EditorViewModelReturnType['onUpdateTable'],
  onCancelTableEdit: EditorViewModelReturnType['onCancelTableEdit'],
} | null;

export const EditTableModalContext = createContext<EditTableContextType>(null)

function EditorView({editorViewModel}: EditorViewArgs) {
  const {currentDbId} = useParams();
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!currentDbId) return;

    console.log('EditView.useEffect', currentDbId);
    editorViewModel.setCurrentDbId(currentDbId);
    /* eslint-disable */
  }, [currentDbId])
  /* eslint-enable */

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
  const headerHeight = headerRef?.current?.clientHeight || 0;

  return (
    <DbContext.Provider value={db}>
      <div className="editor">
        <div ref={headerRef} className="editor__contorls">
          <ContextMenu position="fixed" openMenuMouseButton="LMB" contextItems={[{
            type: 'item',
            name: 'Открыть',
            onClick: async () => await onOpenDb()
          }, {
            type: 'item',
            name: 'Сохранить',
            hint: 'Ctrl + S',
            disabled: isAllowedToSaveFile,
            onClick: async () => await onSaveDb(SaveFileType.Current)
          }, {
            type: 'item',
            name: 'Сохранить как',
            hint: 'Ctrl + Shift + S',
            onClick: async () => await onSaveDb(SaveFileType.New)
          }, {
            type: 'separator'
          }, {
            type: 'list',
            name: 'Экспорт',
            children: [{
              type: 'item',
              name: 'В SQL',
              onClick: () => {
              }
            }]
          }]}>
            <div className="editor-header__controls controls__file">Файл</div>
          </ContextMenu>
        </div>
        <ContextMenu position="dynamic" openMenuMouseButton="RMB"
                     contextMenuPositionOffset={{x: 0, y: -headerHeight}} contextItems={[{
          type: 'item',
          name: 'Создать таблицу',
          onClick: e => {
            console.log(headerRef);
            const position = new Vector2();
            position.x = e.clientX;
            position.y = e.clientY - headerHeight;

            createTable(position);
          },
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
            {
              db?.tables.map(t => {
                const onEditTable = ((id) => () => navigate(`table/${id}/main`))(t.id)
                return <ContextMenu
                  position="dynamic"
                  openMenuMouseButton="RMB"
                  contextMenuPositionOffset={{x: 0, y: -headerHeight}}
                  contextItems={
                    [{
                      type: 'item',
                      name: 'Редактировать',
                      onClick: onEditTable
                    }, {
                      type: 'item',
                      name: 'Удалить',
                      onClick: () => deleteTable(t.id)
                    }]
                  }>
                  <Table
                    key={`table_${t.id}`}
                    props={t}
                    onEditTableClick={onEditTable}
                    onDelete={() => deleteTable(t.id)}
                    headerMouseEvents={{
                      onMouseDown: tableHeaderMouseEvents.onHeaderMouseDown(t.id),
                      onMouseUp: tableHeaderMouseEvents.onHeaderMouseUp,
                      onMouseMove: tableHeaderMouseEvents.onHeaderMouseMove
                    }}
                  />
                </ContextMenu>
              })
            }
            <RelationsDrawer/>
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