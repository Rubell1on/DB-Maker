import useDBModel from "../../models/db/db.model";
import {FormEvent, FormEventHandler, useState} from "react";
import {DB} from "../../models/db/db.types";
import {DbSubmitEventArgs} from "./MainMenu.types";
import {useNavigate} from "react-router-dom";

function useMainMenuViewModel() {
    const {
        dbs,
        createDb: _createDb
    } = useDBModel();

    const navigate = useNavigate();
    const [createDbOpenned, setCreateDbWindow] = useState(false)

    function onCreateDbOpen() {
        setCreateDbWindow(true)
    }

    function onCreateDbClose() {
        setCreateDbWindow(false)
    }

    function onSubmitDb(eventArgs: DbSubmitEventArgs) {
        const {
            e,
            data
        } = eventArgs;

        e.preventDefault();
        _createDb(data);
        navigate('editor')
    }

    return {
        dbs,
        createDbOpenned,
        onCreateDbOpen,
        onCreateDbClose,
        onSubmitDb
    }
}

export default useMainMenuViewModel