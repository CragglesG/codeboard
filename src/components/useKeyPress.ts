import { useCallback, useEffect, useLayoutEffect, useRef } from "react";

const useKeyPress = (
  keys: Array<string>,
  callback: Function,
  node = null,
  ctrlKey: boolean = false,
  shiftKey: boolean = false,
  altKey: boolean = false,
  metaKey: boolean = false
) => {
  // implement the callback ref pattern
  const callbackRef = useRef(callback);
  useLayoutEffect(() => {
    callbackRef.current = callback;
  });

  // handle what happens on key press
  const handleKeyPress = useCallback(
    (e) => {
      // check if one of the key is part of the ones we want
      if (
        keys.some((key) => e.key === key) &&
        e.ctrlKey === ctrlKey &&
        e.shiftKey === shiftKey &&
        e.altKey === altKey &&
        e.metaKey === metaKey
      ) {
        callbackRef.current(e);
      }
    },
    [keys]
  );

  useEffect(() => {
    // target is either the provided node or the document
    const targetNode = node ?? document;
    // attach the event listener
    targetNode && targetNode.addEventListener("keydown", handleKeyPress);

    // remove the event listener
    return () =>
      targetNode && targetNode.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress, node]);
};

export default useKeyPress;
