import {MouseEvent, useState} from "react";
import {Vector2} from "../shared/Vector2";

function useMouseDrag<T extends HTMLElement>() {
  const [currentPosition, setCurrentPosition] = useState(new Vector2());
  const [isDragging, setIsDragging] = useState(false);
  const [diff, setDiff] = useState(new Vector2())

  function onMouseDown(e: MouseEvent<T, globalThis.MouseEvent>) {
    setCurrentPosition({
      x: e.clientX,
      y: e.clientY
    });

    setIsDragging(true);
  }

  function onMouseUp(e: MouseEvent<T, globalThis.MouseEvent>) {
    setIsDragging(false);
  }

  function onMouseMove(e: MouseEvent<T, globalThis.MouseEvent>) {
    if (!isDragging) return;

    const {
      clientX,
      clientY
    } = e;

    setCurrentPosition({
      x: clientX,
      y: clientY
    })

    const x = clientX - currentPosition.x;
    const y = clientY - currentPosition.y;

    setDiff({ x, y });

    // const position = {
    //   x: tablePosition.x + x,
    //   y: tablePosition.y + y
    // };
    // setTablePosition(position);
    //
    // if (onPositionChange) {
    //   onPositionChange(position)
    // }
  }

  return {
    currentPosition,
    isDragging,
    diff,
    onMouseDown,
    onMouseUp,
    onMouseMove
  }
}

export default useMouseDrag