import {Column} from "./Column";

export interface Table {
    id: number;
    name: string;
    position: { x: number, y: number }
    columns: Column[]
}