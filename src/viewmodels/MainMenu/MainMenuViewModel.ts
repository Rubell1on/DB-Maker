import useDBModel from "../../models/db/db.model";
import {FormEvent, FormEventHandler, MouseEventHandler, useEffect, useState, MouseEvent} from "react";
import {DB} from "../../models/db/db.types";
import {DbSubmitEventArgs} from "./MainMenuViewModel.types";
import {useNavigate} from "react-router-dom";

function useMainMenuViewModel(dbModel: ReturnType<typeof useDBModel>) {
  const navigate = useNavigate();
  const [createDbOpenned, setCreateDbWindow] = useState(false);
  const [currentDbId, setCurrentDbId] = useState<string | null>(null);

  const {
    dbs,
    createDb,
    updateDb,
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
    navigate(`/editor/${db.id}`)
  }

  function onDeleteDB(e: MouseEvent<HTMLElement>, dbId: string) {
    e.stopPropagation();
    deleteDb(dbId);
  }

  return {
    dbs,
    currentDbId,
    createDbOpenned,
    onCreateDbOpen,
    onCreateDbClose,
    onSubmitDb,
    onDeleteDB
  }
}

export default useMainMenuViewModel