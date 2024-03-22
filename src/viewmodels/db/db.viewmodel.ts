import {useReducer, Reducer} from "react";

interface DB {
    id: number;
    name: string;
}

enum DbViewModelActionType {
    setDB = 'SET_DB'
}

interface DbViewModelAction {
    type: DbViewModelActionType;
    payload: DB
}

function dbViewModelReducer(state: DB | null, action: DbViewModelAction) {
    const { type, payload } = action;

    switch(type) {
        case DbViewModelActionType.setDB: {
            return {
                ...state,
                ...payload
            } as DB;
        }

        default: {
            throw new Error(`This action "${action}" is not implemented`);
        }
    }
}

function useDbViewModel() {
    const [db, dispatch] = useReducer<Reducer<DB | null, DbViewModelAction>>(dbViewModelReducer, null);

    function setDb(db: DB) {
        return dispatch({
            type: DbViewModelActionType.setDB,
            payload: db
        });
    }

    return {
        db,
        setDb
    }
}
