import {useState} from "react";
import uuid from 'react-uuid';
import {DB} from "./db.types";

function useDBModel() {
    const [dbs, setDbs] = useState<DB[]>([]);

    function createDb(args: Omit<DB, 'id'>) {
        const db: DB = {
            id: uuid(),
            ...args
        }

        setDbs([...dbs, db])
    }

    function updateDb(id: string, dbArgs: Partial<DB>) {
        const targetDbs = dbs.map(db => {
            return db.id === id
            ? { ...db, ...dbArgs }
            :  db;
        });

        setDbs(targetDbs)
    }

    // function deleteDb(id: string) {
    //     setDbs(dbs.filter(db => db.id !== id))
    // }

    function getFromLocalStorage() {

    }

    return {
        dbs,
        createDb,
        updateDb,
        // deleteDb
    }
}

export default useDBModel