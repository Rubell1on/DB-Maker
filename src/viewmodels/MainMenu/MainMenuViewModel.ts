import useDBModel from "../../models/db/db.model";
import {MouseEvent, useState} from "react";
import {DbSubmitEventArgs} from "./MainMenuViewModel.types";
import {useNavigate} from "react-router-dom";
import {useFile} from "../../hooks/useFile";

function useMainMenuViewModel(
  dbModel: ReturnType<typeof useDBModel>,
  fileHook: ReturnType<typeof useFile>
) {
  const navigate = useNavigate();
  const [createDbOpenned, setCreateDbWindow] = useState(false);
  const [currentDbId, setCurrentDbId] = useState<string | null>(null);

  const {
    dbs,
    createDb,
    deleteDb
  } = dbModel;

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
    const db = createDb(data);
    setCurrentDbId(db.id);
    navigate(`DB-Maker/editor/${db.id}`)
  }

  function onDeleteDB(e: MouseEvent<HTMLElement>, dbId: string) {
    e.stopPropagation();
    deleteDb(dbId);
  }

  async function onOpenDb() {
    const db = await fileHook.load();

    if (!db) {
      console.error(`Не удалось загрузить файл БД`);
      return;
    }

    dbModel.setDbs([db]);

    setCurrentDbId(db.id);
    navigate(`DB-Maker/editor/${db.id}`)
  }

  return {
    dbs,
    currentDbId,
    createDbOpenned,
    onOpenDb,
    // onSaveDb,
    onCreateDbOpen,
    onCreateDbClose,
    onSubmitDb,
    onDeleteDB
  }
}

export default useMainMenuViewModel