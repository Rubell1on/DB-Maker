import './Editor.css'
import Table from "../../components/table/Table";
import {DB, Table as TableDTO} from "../../models/db/db.types";
import {createContext, useEffect, useState} from 'react'
import EditTableModal, {EditTableModalTabContext} from "./EditTableModal/EditTableModal";
import RelationsDrawerV2 from "../../components/RelationsDrawer/RelationDrawerV2";
import {EditorViewArgs} from "./EditorView.types";
import {Link, NavLink, Outlet, useLocation, useNavigate, useParams} from "react-router-dom";
import {Vector2} from "../../shared/Vector2";
import {Routes, Route} from "react-router-dom";
import ModalWindow from "../../components/ModalWindow/ModalWindow";
import Button from "../../components/Base/Button/Button";
import useEditorViewModel from "../../viewmodels/Editor/EditorViewModel";

// interface ContextMenuState {
//     position: {
//         x: number,
//         y: number,
//     } | null,
//     value: boolean
// }

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
    selectedTables,
    editingTable,
    onUpdateTable,
    onEditTableClick,
    onCancelTableEdit,
    tableHeaderMouseEvents
  } = editorViewModel;

  const navigate = useNavigate();

  // const [
  //     spaceContextMenu,
  //     setSpaceContextMenu
  // ] = useState<ContextMenuState>({
  //     position: {
  //         x: 0,
  //         y: 0
  //     },
  //     value: false
  // });

  return (
    <DbContext.Provider value={db}>
      <div className="editor">
        <div className="editor__contorls">
          <button className="controls__open-db" onClick={onOpenDb}>Открыть</button>
          <button className="controls__save-db" onClick={onSaveDb}>Сохранить как</button>
          <button className="controls__add-table" onClick={createTable}>Добавить таблицу</button>
        </div>
        <div className="editor__space" /*onContextMenu={onEditorSpaceContextMenu}*/>
          {/*{spaceContextMenu.value*/}
          {/*    ? (*/}
          {/*        <>*/}
          {/*            <div style={{*/}
          {/*                position: 'absolute',*/}
          {/*                left: spaceContextMenu?.position?.x,*/}
          {/*                top: spaceContextMenu?.position?.y,*/}
          {/*                background: 'red'*/}
          {/*            }}>context menu</div>*/}
          {/*            < div*/}
          {/*                className = "space__context"*/}
          {/*                onClick={onCloseSpaceContextMenu}*/}
          {/*                style={{width: '100%', height: '100%', opacity: 0, position: "absolute"}}*/}
          {/*            ></div>*/}
          {/*        </>*/}
          {/*    )*/}

          {/*    : null*/}
          {/*}*/}

          {/*{*/}
          {/*  editingTable*/}
          {/*    ?*/}
          {/*    <ModalWindow>*/}
          {/*      <div>*/}
          {/*        <div className="links">*/}
          {/*          <h3>Навигация</h3>*/}
          {/*          <NavLink to="columns">Колонки</NavLink>*/}
          {/*          <NavLink to="relations">Связи</NavLink>*/}
          {/*        </div>*/}
          {/*        <div className="routes">*/}
          {/*          <Routes>*/}
          {/*            <Route path='columns' element={<div>columns</div>}/>*/}
          {/*            <Route path='relations' element={<div>relations</div>}/>*/}
          {/*          </Routes>*/}
          {/*        </div>*/}
          {/*      </div>*/}
          {/*    </ModalWindow>*/}
          {/*    */}
          {/*    // <EditTableModal*/}
          {/*    //   props={{*/}
          {/*    //     ...selectedTables[0],*/}
          {/*    //     onSubmit: (t) => onUpdateTable(selectedTables[0].id, t),*/}
          {/*    //     onCancel: onCancelTableEdit*/}
          {/*    // }}/>*/}
          {/*    : null*/}
          {/*}*/}

          {/*<EditTableModal*/}
          {/*  props={{*/}
          {/*    ...selectedTables[0],*/}
          {/*    onSubmit: (t) => onUpdateTable(selectedTables[0].id, t),*/}
          {/*    onCancel: () => {navigate(`/editor/${currentDbId}`)}*/}
          {/*  }}/>*/}

          {db?.tables.map(t => <Table
            key={`table_${t.id}`}
            props={t}
            // onEditTableClick={onEditTableClick(t.id)}
            onEditTableClick={((id) => () => navigate(`table/${id}/main`))(t.id)}
            onDelete={() => deleteTable(t.id)}
            headerMouseEvents={{
              onMouseDown: tableHeaderMouseEvents.onHeaderMouseDown(t.id),
              onMouseUp: tableHeaderMouseEvents.onHeaderMouseUp,
              onMouseMove: tableHeaderMouseEvents.onHeaderMouseMove
            }}
          ></Table>)}
          <RelationsDrawerV2/>
        </div>
        <EditTableModalContext.Provider value={{
          onUpdateTable,
          onCancelTableEdit
        }}>
          <Outlet/>
        </EditTableModalContext.Provider>
      </div>
    </DbContext.Provider>
  )

  // function onEditorSpaceContextMenu(e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) {
  //     e.preventDefault();
  //     if (!spaceContextMenu.value) {
  //         const target = (e.nativeEvent?.target as HTMLDivElement);
  //         const position = {
  //             x: e.clientX,
  //             y: e.clientY - target.offsetTop
  //         }
  //         setSpaceContextMenu({position, value: true});
  //     } else {
  //         setSpaceContextMenu({position: null, value: false});
  //     }
  // }
  //
  // function onCloseSpaceContextMenu(e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) {
  //     e.preventDefault();
  //     setSpaceContextMenu({position: null, value: false});
  // }

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