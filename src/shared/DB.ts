import {Table} from "./Table";

export interface DB {
    id: number;
    name: string;
    type: 'postgres';
    tables: Table[];
}