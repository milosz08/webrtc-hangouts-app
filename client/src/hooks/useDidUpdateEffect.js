'use strict';

/*
 * Part of Silesian University of Technology project.
 * Created only for learning purposes.
 */
import { useEffect, useRef } from 'react';

const useDidUpdateEffect = (fn, inputs) => {
  const isMountingRef = useRef(false);

  useEffect(() => {
    isMountingRef.current = true;
  }, []);

  useEffect(() => {
    if (!isMountingRef.current) {
      return fn();
    } else {
      isMountingRef.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, inputs);
};

export default useDidUpdateEffect;
