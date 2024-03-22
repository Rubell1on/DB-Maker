import {Vector2} from "../../shared/Vector2";

export enum DBType {
    Postgres = 'POSTGRES'
}

export interface DB {
    id: string;
    name: string;
    type: DBType;
    createDate: Date;
    tables: Table[]
    // relations: Relation[]
    // associatedWith: {
    //     tableId: string;
    //     columnId: string;
    // }[]
}

export interface Table {
    id: number;
    name: string;
    position: Vector2
    columns: Column[]
}

export enum ColumnType {
    Int = 'INT',
    Varchar = 'VARCHAR',
    Serial = 'SERIAL'
}

export interface Column {
    id: number;
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
    foreignKeyName: string;
    type: RelationType;
    referenceTableId: number | null;
    referenceColumnId: number | null;
}