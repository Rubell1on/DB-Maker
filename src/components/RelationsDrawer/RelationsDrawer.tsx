import {useContext, useEffect} from "react";
import {DbContext} from "../../views/Editor/Editor";
import {Vector2} from "../../shared/Vector2";

function RelationsDrawer() {
    const db = useContext(DbContext)!;
    useEffect(() => {
        const workspace = document.querySelector('.editor__space')!;
        const canvas = document.querySelector(".space__canvas") as HTMLCanvasElement;
        canvas.width = workspace.clientWidth;
        canvas.height = workspace.clientHeight;
        const ctx = canvas.getContext("2d")!;

        const td = db?.tables?.reduce((tablesAcc, table) => {
            let tData: {
                selfPos: Vector2,
                cols: Map<number, {
                    refTableId: number | null,
                    refColumnId: number | null,
                    colInd: number,
                }>
            } | null = null;

            table.columns.reduce((colsMap, col, i) => {
                const colData = {
                    colInd: i,
                    refTableId: col?.relation?.referenceTableId || null,
                    refColumnId: col?.relation?.referenceColumnId || null
                };

                if (!tData) {
                    const cols = new Map<number, {
                        colInd: number,
                        refTableId: number | null,
                        refColumnId: number | null
                    }>();

                    tData = {
                        selfPos: table.position,
                        cols
                    }
                }

                tData.cols.set(col.id, colData);

                return colsMap;
            }, new Map<number, {
                refTableId: number | null,
                refColumnId: number | null,
                colInd: number,
            }>());

            if (tData) {
                tablesAcc.set(table.id, tData);
            }

            return tablesAcc;
        }, new Map<number, {
            selfPos: Vector2,
            cols: Map<number, {
                refTableId: number | null,
                refColumnId: number | null,
                colInd: number,
            }>
        }>())

        console.log(td);

        if (td.size === 0) {
            return;
        }

        const rowHeight = 20;

        for (let [, tData] of td) {
            for (let [, cData] of tData.cols) {
                if (!cData?.refTableId || !cData?.refColumnId) {
                    continue;
                }

                interface T {
                    data: typeof tData,
                    colInd: number
                }

                let first: T | null = null;
                let second: T | null = null;

                const refTData = td.get(cData.refTableId);

                if (!refTData) continue;

                if (tData.selfPos.x > refTData.selfPos.x) {
                    second = {
                        data: tData,
                        colInd: cData.colInd
                    };

                    first = {
                        data: refTData,
                        colInd: refTData.cols.get(cData.refColumnId)!.colInd
                    };
                } else {
                    second = {
                        data: refTData,
                        colInd: refTData.cols.get(cData.refColumnId)!.colInd
                    };
                    first = {
                        data: tData,
                        colInd: cData.colInd
                    };
                }

                const calcY = (ind: number): number => {
                    const targetInd = ind + 2;
                    return rowHeight * targetInd - (rowHeight / 2)
                }

                const startX = first?.data?.selfPos?.x + 200;
                const startY = first?.data?.selfPos?.y + calcY(first.colInd);

                const endX = second?.data?.selfPos?.x;
                const endY = second?.data?.selfPos?.y + calcY(second.colInd);

                const middle = (startX + endX) / 2

                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.bezierCurveTo(middle, startY, middle, endY, endX, endY);
                ctx.stroke();
            }
        }

    }, [db]);

    return (
        <canvas className="space__canvas"/>
    )
}

export default RelationsDrawer