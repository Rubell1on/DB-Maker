import {ModalBaseProps} from "../../../shared/ModalBaseProps";
import {Props} from "../../../shared/Props";
import {Column, Relation, RelationType} from "../../../shared/Column";
import {Table} from "../../../shared/Table";
import {ChangeEvent, MouseEvent, useState} from "react";
import './EditorModal.css'

interface RelationEditorModalProps {
    relation: Relation | null,
    tables: Table[]
}

function RelationEditorModal({props}:Props<RelationEditorModalProps & ModalBaseProps<any>>) {
    const [relation, setRelation] = useState<Relation>(props.relation || {
        foreignKeyName: 'fk',
        type: RelationType.OneToOne,
        referenceTableId: null,
        referenceColumnId: null
    })
    const [referenceTable, setReferenceTable] = useState<Table | null>(props.tables.find(({id}) => relation.referenceTableId) || props.tables[0] || null);
    // const [referenceColumn, setReferenceColumn] = useState<Column | null>();
    return (
        <form className="editor-modal relation-editor" style={{zIndex: 3}} onSubmit={onSubmitRelation}>
            <h3>Редактор связей</h3>
            <label>Наименование внешного ключа</label>
            <input type="text" name="foreignKeyName" className="relation-editor__foreign-key" required
                   defaultValue={relation.foreignKeyName} onChange={onUpdate}/>
            <label>Тип связи</label>
            <select name="type" className="relation-editor__type" defaultValue={relation.type} onChange={onUpdate}>
                {
                    Object.entries(RelationType).map(([key, value]) => {
                        return <option value={value}>{key}</option>
                    })
                }
            </select>
            <label>Внешняя таблица</label>
            <select name="referenceTableId" className="relation-editor__reference-table" defaultValue={relation?.referenceTableId!} onChange={onUpdate}>
                <option value={undefined}></option>
                {
                    props.tables.map(({id, name}) => {
                        return <option value={id}>{name}</option>
                    })
                }
            </select>
            {
                referenceTable
                    ? <>
                        <label>Внешняя колонка</label>
                        <select name="referenceColumnId" className="relation-editor__reference-columnId" defaultValue={relation?.referenceColumnId!} onChange={onUpdate}>
                            <option value={undefined}></option>
                            {
                                referenceTable.columns.map(({id, name}) => {
                                    return <option value={id}>{name}</option>
                                })
                            }
                        </select>
                    </>
                    : null
            }
            <input type="submit" className="relation-editor__submit" value="Сохранить"/>
            <input type="button" className="relation-editor__cancel" value="Отмена" onClick={props.onCancel}/>
        </form>
    )

    function onUpdate(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;

        let targetValue: string | number | null = value;

        switch (name) {
            case 'referenceColumnId': {
                const tableId = parseInt(value);
                targetValue = referenceTable?.columns.find(({id}) => id === tableId)?.id|| null;

                break;
            }

            case 'referenceTableId': {
                const tableId = parseInt(value);
                targetValue = tableId;
                setReferenceTable(props.tables.find(({id}) => id === tableId)!);
                break;
            }
        }

        setRelation({...relation, [name]: targetValue})
    }

    function onSubmitRelation(e: MouseEvent<HTMLFormElement, globalThis.MouseEvent>) {
        e.preventDefault();
        props.onSubmit({...relation});
    }
}

export default RelationEditorModal