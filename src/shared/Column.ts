import { Table } from "./Table";

export enum ColumnType {
    Int = 'INT',
    Varchar = 'VARCHAR',
    Serial = 'SERIAL'
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
export interface Column {
    id: number;
    name: string;
    type: ColumnType;
    isPrimaryKey: boolean;
    sort: number;
    relation: Relation | null,
    // parentTable: Table
}