import './Editor.css'
import Table from "../../components/table/Table";
import { Table as TableProps } from '../../shared/Table';
import {DB} from "../../shared/DB";
import {createContext, useState} from 'react'
import EditTableModal from "./EditTableModal/EditTableModal";
import RelationsDrawer from "../../components/RelationsDrawer/RelationsDrawer";

// interface ContextMenuState {
//     position: {
//         x: number,
//         y: number,
//     } | null,
//     value: boolean
// }

export const DbContext = createContext<DB | null>(null);
function Editor() {
    const [db, setDb] = useState<DB>({
        id: 1,
        name: "DB",
        type: 'postgres',
        tables: []
    });

    const [selectedTables, setSelectedTables] = useState<TableProps[]>([]);
    const [editingTable, setEditingTable] = useState(false);

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
                    <button className="controls__add-table" onClick={onAddTable}>Добавить таблицу</button>
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
                    {
                        editingTable
                            ? <EditTableModal
                                props={{...selectedTables[0], onSubmit: saveTableInfo, onCancel: onCancelTableEdit}}/>
                            : null
                    }
                    {db.tables.map(t => <Table
                        key={`table_${t.id}`}
                        id={t.id}
                        name={t.name} columns={t.columns}
                        position={t.position}
                        onEditTableClick={onEditTable(t.id)}
                        onPositionChange={onTablePositionChange(t.id)}
                        onDelete={onDeleteTable}
                    ></Table>)}
                    <RelationsDrawer />
                </div>
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

    function onAddTable() {
        const {tables} = db;
        const nextIndex = tables[tables.length - 1]?.id + 1 || 1;

        const newTable = {
            id: nextIndex,
            name: `Таблица ${nextIndex}`,
            columns: [],
            position: { x: 0, y: 0 }
        };

        setDb({
            ...db,
            tables: [...tables, newTable]
        })
    }

    function onEditTable(tableId: number) {
        return () => {
            setSelectedTables(db.tables.filter(({id}) => id === tableId))
            setEditingTable(true);
        }
    }

    function onDeleteTable(tableId: number) {
        const tables = db.tables.filter(({id}) => id !== tableId);
        setDb({...db, tables});
    }
    function saveTableInfo(props: TableProps) {
        setDb({
            ...db,
            tables: db.tables.map(t => {
                return t.id === props.id ? props : t;
            })
        });

        setEditingTable(false);
    }

    function onCancelTableEdit() {
        setEditingTable(false);
    }

    function onTablePositionChange(tableId: number) {
        return (position: {x: number, y: number}) => {
            const tables = db.tables.map(t => {
                return t.id === tableId ? {...t, position} : t
            })
            setDb({...db, tables })
        }

    }

    async function onOpenDb() {
        const filePickerOptions: OpenFilePickerOptions = {
            types: [{
                description: 'Файл dbm',
                accept: { 'application/dbm': ['.dbm'] }
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

        setDb(parsedDb);
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

export default Editor;