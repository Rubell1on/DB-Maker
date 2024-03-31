import ModalWindow from "../../../components/ModalWindow/ModalWindow";
import {ChangeEvent, useState} from "react";
import './CreateDBModal.css'
import {DB, DBType} from "../../../models/db/db.types";
import {DbSubmitEventArgs} from "../../../viewmodels/MainMenu/MainMenuViewModel.types";
import useMainMenuViewModel from "../../../viewmodels/MainMenu/MainMenuViewModel";
import Input from "../../../components/Base/Input/Input";
import Label from "../../../components/Base/Label/Label";
import Select from "../../../components/Base/Select/Select";
import Option from "../../../components/Base/Option/Option";
import Button from "../../../components/Base/Button/Button";

interface CreateDBProps {
    onSubmitDb: (eventArgs: DbSubmitEventArgs) => void
    onClose: () => void
}

function CreateDBModal(props: CreateDBProps) {
    const dbDefaultValue = {
        name: '',
        type: DBType.Postgres,
        createDate: new Date(),
        tables: [],
        relations: [],
        associatedWith: []
    }

    const [db, setDb] = useState<Omit<DB, 'id'>>(dbDefaultValue)
    return (
        <ModalWindow title="Создание новой БД" onClose={props?.onClose}>
            <form className="create-db__form" onSubmit={onSubmit}>
                <Label htmlFor="create-db__name" title="Наименование БД"/>
                <Input type='text' id="create-db__name" name="name" required minLength={3} onChange={onChange}/>
                <Label htmlFor="create-db__type" title="Тип БД" />
                <Select name="type" id="create-db__type" defaultValue={DBType.Postgres} onChange={onChange}>
                    {
                        Object.entries(DBType).map(([key, value]) => {
                            return <Option value={value}>{key}</Option>
                        })
                    }
                </Select>
                <div className="create-db__controls">
                    <Button type="submit" className="create-db__submit" value="Создать" />
                    <Button type="button" className="create-db__close" value="Отмена" onClick={props?.onClose} />
                </div>
            </form>
        </ModalWindow>
    )

    function onChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = (e.target as HTMLInputElement);

        setDb({ ...db, [name]: value })
    }

    function onSubmit(e: any) {
        props.onSubmitDb({e, data: db})
    }
}

export default CreateDBModal