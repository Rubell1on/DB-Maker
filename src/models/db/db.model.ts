import {useEffect, useState} from "react";
import uuid from 'react-uuid';
import {DB} from "./db.types";

function useDBModel() {
  const [dbs, setDbs] = useState<DB[]>([]);

  useEffect(() => {
    getFromLocalStorage();
  },[dbs.length])

  function createDb(args: Omit<DB, 'id'>) {
    const db: DB = {
      id: uuid(),
      ...args
    }

    const targetDbs = [...dbs, db];
    setDbs(targetDbs);
    saveToLocalStorage(targetDbs);

    return db;
  }

  function updateDb(id: string, dbArgs: Partial<DB>) {
    const targetDbs = dbs.map(db => {
      return db.id === id
        ? {...db, ...dbArgs}
        : db;
    });

    setDbs(targetDbs);
    saveToLocalStorage(targetDbs);
  }

  function deleteDb(id: string) {
    const _dbs = dbs.filter(db => db.id !== id);
    setDbs(_dbs);
    saveToLocalStorage(_dbs);
  }

  function getFromLocalStorage() {
    const serializedDbs = localStorage.getItem('dbs');

    if (!serializedDbs?.length) {
      console.log('LocalStorage не содержит данных о бд');
      return;
    }

    let dbs: DB[] = [];

    try {
      dbs = JSON.parse(serializedDbs);
    } catch (e) {
      console.error(`Ошибка парсинга данных о БД: ${e}`);
      return;
    }

    setDbs(dbs);
  }

  function saveToLocalStorage(dbs: DB[]) {
    localStorage.setItem('dbs', JSON.stringify(dbs))
  }

  return {
    dbs,
    setDbs,
    createDb,
    updateDb,
    deleteDb
  }
}

export default useDBModel