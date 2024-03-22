import ModalWindow from "../../../components/ModalWindow/ModalWindow";
import {useState} from "react";
import './CreateDBModal.css'
import {DB, DBType} from "../../../models/db/db.types";
import {DbSubmitEventArgs} from "../../../viewmodels/MainMenu/MainMenu.types";
import useMainMenuViewModel from "../../../viewmodels/MainMenu/MainMenu";

interface CreateDBProps {
    onSubmitDb: (eventArgs: DbSubmitEventArgs) => void
    onClose: () => void
}

function CreateDBModal(props: CreateDBProps) {
    const dbDefaultValue = {
        name: '',
        type: DBType.Postgres,
        createData: new Date(),
        tables: [],
        relations: [],
        associatedWith: []
    }

    const [db, setDb] = useState<Omit<DB, 'id'>>(dbDefaultValue)
    return (
        <ModalWindow title="Создание новой БД" onClose={props?.onClose}>
            <form className="create-db__form" onSubmit={onSubmit}>
                <label htmlFor="create-db__name">Наименование БД</label>
                <input type="text" id="create-db__name" name="name" required onChange={onChange}/>
                <label htmlFor="create-db__type">Тип БД</label>
                <select name="type" id="create-db__type" defaultValue={DBType.Postgres} onChange={onChange}>
                    {
                        Object.entries(DBType).map(([key, value]) => {
                            return <option value={value} >{key}</option>
                        })
                    }
                </select>
                <input type="submit" className="create-db__submit" value="Создать"/>
            </form>
        </ModalWindow>
    )

    function onChange(e: any) {
        const { name, value } = (e.target as HTMLInputElement);

        setDb({ ...db, [name]: value })
    }

    function onSubmit(e: any) {
        props.onSubmitDb({e, data: db})
    }
}

export default CreateDBModal