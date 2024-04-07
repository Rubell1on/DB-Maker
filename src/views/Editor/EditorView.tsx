import './Editor.css'
import Table from "../../components/table/Table";
import {DB} from "../../models/db/db.types";
import {createContext, useEffect} from 'react'
import {EditorViewArgs} from "./EditorView.types";
import {Outlet, useNavigate, useParams} from "react-router-dom";
import useEditorViewModel from "../../viewmodels/Editor/EditorViewModel";
import ContextMenu from "../../components/ContextMenu/ContextMenu";
import RelationsDrawer from "../../components/RelationsDrawer/RelationDrawer";

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
    tableHeaderMouseEvents
  } = editorViewModel;

  const navigate = useNavigate();

  return (
    <DbContext.Provider value={db}>
      <div className="editor">
        <div className="editor__contorls">
          <ContextMenu position="fixed" contextItems={[{
            type: 'item',
            name: 'Открыть',
            onClick: onOpenDb
          }, {
            type: 'item',
            name: 'Сохранить как',
            onClick: onSaveDb
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
        <ContextMenu position="dynamic" contextMenuPositionOffset={{x: 0, y: -40}} contextItems={[{
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
              <ContextMenu position="dynamic" contextMenuPositionOffset={{x: 0, y: -40}} contextItems={[{
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

  async function onOpenDb() {
    const filePickerOptions: OpenFilePickerOptions = {
      types: [{
        description: 'Файл dbm',
        accept: {'application/dbm': ['.dbm']}
      }],
      multiple: false,
      excludeAcceptAllOption: true
    };

    let fileHandlers: FileSystemFileHandle[] = [];

    try {
      fileHandlers = await window.showOpenFilePicker(filePickerOptions);
    } catch (error) {
      console.error(error);
    }

    if (!fileHandlers.length) {
      return;
    }

    const file = await fileHandlers[0].getFile();

    let parsedDb: DB | null = null;

    try {
      parsedDb = JSON.parse(await file.text())
    } catch ({message}) {
      console.error(`Ошибка парсинга файла базы данных: ${message}`);
    }

    if (!parsedDb) {
      return;
    }

    // setDb(parsedDb);
  }

  async function onSaveDb() {
    const saveFileOptions: SaveFilePickerOptions = {
      types: [{
        description: 'Файл dbm',
        accept: {'application/dbm': ['.dbm']}
      }],
      excludeAcceptAllOption: true,
    }

    let saveHandle: FileSystemFileHandle | null = null;

    try {
      saveHandle = await window.showSaveFilePicker(saveFileOptions);
    } catch (error) {
      console.error(error);
    }

    if (!saveHandle) {
      return;
    }

    const writableStream = await saveHandle.createWritable();
    await writableStream.write(JSON.stringify(db));
    await writableStream.close();
  }
}

export default EditorView;