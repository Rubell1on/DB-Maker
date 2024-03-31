import {useContext, useEffect} from "react";
import {DbContext} from "../../views/Editor/EditorView";
import {Vector2} from "../../shared/Vector2";

function RelationsDrawerV2() {
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
        cols: Map<string, {
          refTableId: string | null,
          refColumnId: string | null,
          colInd: number,
        }>
      } = {
        selfPos: table.position,
        cols: new Map<string, {
          refTableId: string | null,
          refColumnId: string | null,
          colInd: number,
        }>()
      };

      table.columns.reduce((colsMap, col, i) => {
        const rel = table.relations.find(r => {
          return r.columnId === col.id
        });

        const colData = {
          colInd: i,
          refTableId: rel?.referenceTableId || null,
          refColumnId: rel?.referenceColumnId || null
        };

        if (!tData) {
          const cols = new Map<string, {
            colInd: number,
            refTableId: string | null,
            refColumnId: string | null
          }>();

          tData = {
            selfPos: table.position,
            cols
          }
        }

        tData.cols.set(col.id, colData);

        return colsMap;
      }, new Map<string, {
        refTableId: string | null,
        refColumnId: string | null,
        colInd: number,
      }>());

      if (tData) {
        tablesAcc.set(table.id, tData);
      }

      return tablesAcc;
    }, new Map<string, {
      selfPos: Vector2,
      cols: Map<string, {
        refTableId: string | null,
        refColumnId: string | null,
        colInd: number,
      }>
    }>())

    console.log(td);

    if (!td?.size) {
      return;
    }

    const rowHeight = 22;

    for (let [, tData] of td) {
      for (let [, cData] of tData.cols) {
        if (!cData?.refTableId?.length || !cData?.refColumnId?.length) {
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
        const startY = first?.data?.selfPos?.y + calcY(first.colInd) - 2;

        const endX = second?.data?.selfPos?.x;
        const endY = second?.data?.selfPos?.y + calcY(second.colInd) + 2;

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

export default RelationsDrawerV2