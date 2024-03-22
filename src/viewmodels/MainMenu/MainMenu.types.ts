import {FormEvent} from "react";
import {DB} from "../../models/db/db.types";

export interface DbSubmitEventArgs {
    e: FormEvent<HTMLFormElement>,
    data: Omit<DB, 'id'>
}