import {Vector2} from "../../shared/Vector2";

export enum DBType {
    Postgres = 'POSTGRES'
}

export interface DB {
    id: string;
    name: string;
    type: DBType;
    createDate: Date;
    tables: Table[];
}

export interface Table {
    id: string;
    name: string;
    position: Vector2
    columns: Column[];
    relations: Relation[];
    associatedWith: {
        tableId: string;
        columnId: string;
    }[];
}

export enum ColumnType {
    Int = 'INT',
    Varchar = 'VARCHAR',
    Serial = 'SERIAL'
}

export interface Column {
    id: string;
    name: string;
    type: ColumnType;
    isPrimaryKey: boolean;
    sort: number;
}

export enum RelationType {
    OneToOne = 'ONE_TO_ONE',
    OneToMany = 'ONE_TO_MANY',
    ManyToOne = 'MANY_TO_ONE'
}

export interface Relation {
    id: string;
    foreignKeyName: string;
    columnId: string;
    type: RelationType;
    referenceTableId: string;
    referenceColumnId: string;
}