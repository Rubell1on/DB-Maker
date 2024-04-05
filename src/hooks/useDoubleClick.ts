import {useState} from "react";

function useDoubleClick(callback: (e?: any) => void, delayMs = 200) {
  const [startDate, setStartDate] = useState<number | null>(null);

  function onClick() {
    if (typeof startDate !== 'number' || +new Date() - startDate > delayMs) {
      setStartDate(+new Date());
      return;
    }

    callback();
    setStartDate(null);
  }

  return {
    onClick
  }
}

export default useDoubleClick;