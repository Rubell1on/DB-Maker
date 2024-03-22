import {Table} from "../../../shared/Table";
import {ChangeEvent, MouseEvent, useContext, useState} from "react";
import './EditTableModal.css'
import {Column, ColumnType, Relation} from "../../../shared/Column";
import {ModalBaseProps} from "../../../shared/ModalBaseProps";
import {Props} from "../../../shared/Props";
import RelationEditorModal from "./RelationEditorModal";
import {DbContext} from "../Editor";
import './EditorModal.css'

function EditTableModal({props}: Props<Table & ModalBaseProps<Table>>) {
    const [table, setTable] = useState({...props});
    const [selectedColumn, setSelectedColumn] = useState<Column | null>(null);
    const [editingRelation, setEditingRelation] = useState(false);
    const dbContext = useContext(DbContext);

    return (
        <>
            {
                editingRelation
                ? <RelationEditorModal props={{
                    relation: selectedColumn?.relation || null,
                    tables: dbContext?.tables || [],
                    onCancel: () => setEditingRelation(false),
                    onSubmit: onSubmitRelation
                }}/>
                    :null
            }
            <form className="editor-modal table-editor" onSubmit={onSubmitTable}>
                <h3 className="table-editor__header">Редактировать таблицу</h3>
                <label htmlFor="table-name">Наименование таблицы</label>
                <input type="text" id="table-name" name="name" required={true} className="table-editor__name" defaultValue={table.name}
                       onChange={onUpdateTable}/>

                <div className="table-editor__columns">
                    <h4 className="className columns__header">Колонки</h4>
                    { table.columns.length
                        ? <table>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Нименование колонки</th>
                                    <th>Первичный ключ</th>
                                    <th>Тип</th>
                                    <th>Внешний ключ</th>
                                </tr>
                            </thead>
                            <tbody>
                            {
                                table.columns.map((c, i) => {
                                    const onChange = onUpdateColumn(c.id);
                                    return <tr key={`name_${i}`} className="columns__column">
                                        <td>
                                            <input type="button" className="column__delete" value="-" onClick={deleteColumn(c.id)}/>
                                        </td>
                                        <td>
                                            <input type="text" name="name" className="column__name"
                                                   defaultValue={c.name}
                                                   onChange={onChange}/>
                                        </td>
                                        <td>
                                            <input type="checkbox" name="isPrimaryKey" className="column__primary"
                                                   defaultChecked={c.isPrimaryKey} onChange={onChange}/>
                                        </td>
                                        <td>
                                            <select className="column__type" name="type" defaultValue={c.type}
                                                    onChange={onChange}>
                                                {
                                                    Object.entries(ColumnType).map(([key, value], i) => {
                                                        return <option key={`type_option_${i}`}
                                                                       value={value}>{key}</option>
                                                    })
                                                }
                                            </select>
                                        </td>
                                        <td>
                                            <input type="button" className="column__edit-relation" value={c.relation ? "*" : "+"} onClick={setRelationData(c)}/>
                                            {
                                                c.relation
                                                    ? <input type="button" className="column__edit-relation" value="-" onClick={() => onRelationDelete(c.id)}/>
                                                    : null
                                            }
                                        </td>
                                    </tr>
                                })
                            }
                            </tbody>
                        </table>
                        : null
                    }
                    <input type="button" className="table-editor__add-column" onClick={onAddColumn} value="Добавить колонку"/>
                </div>

                <input type="submit" className="table-editor__submit" value="Сохранить"/>
                <input type="button" className="table-editor__cancel" onClick={props.onCancel} value="Отмена"/>
            </form>
        </>
    )

    function onUpdateTable(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const {name, value} = e.target;

        setTable({...table, [name]: value});
    }

    function onUpdateColumn(columnId: number) {
        return (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
            const {name, value} = e.target;

            const columns = table.columns.map(c => {
                if (c.id !== columnId) return c;

                let targetValue: string | boolean = value;

                if (name === 'isPrimaryKey') {
                    targetValue = !c.isPrimaryKey
                }

                return {
                    ...c,
                    [name]: targetValue
                };
            })

            setTable({...table, columns });
        }
    }

    function onRelationDelete(columnId: number) {
        const columns = table.columns.map(c => {
            return c.id === columnId ? { ...c, relation: null } : c;
        })
        setTable({...table, columns })
    }

    function onSubmitTable(e: MouseEvent<HTMLFormElement, globalThis.MouseEvent>) {
        e.preventDefault();
        props.onSubmit(table)
    }

    function onAddColumn() {
        const {columns} = table;
        const id = (columns?.[columns?.length - 1]?.id || 0) + 1;
        const newColumn: Column = {
            id,
            name: 'Колонка',
            type: ColumnType.Int,
            // parentTable: table,
            sort: id,
            relation: null,
            isPrimaryKey: false,
        }
        setTable({...table, columns: [...table.columns, newColumn]})
    }

    function deleteColumn(columnId: number) {
        return () => {
            const columns = table.columns.filter(({id}) => id !== columnId)
            setTable({...table, columns})
        }
    }

    function setRelationData(column: Column) {
        return () => {
            setSelectedColumn(column);
            setEditingRelation(true);
        }
    }

    function onSubmitRelation(data: Relation) {
        const columns: Column[] = table.columns.map(c => {
            return c.id === selectedColumn?.id! ? { ...selectedColumn!, relation: data } : c
        });

        setTable({...table, columns});
        setEditingRelation(false);
    }
}

export default EditTableModal