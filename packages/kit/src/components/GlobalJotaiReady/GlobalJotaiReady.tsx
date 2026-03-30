import { startTransition, useEffect, useState } from 'react';

import { View } from 'react-native';

import { globalJotaiStorageReadyHandler } from '@onekeyhq/kit-bg/src/states/jotai/jotaiStorage';
import { debugLandingLog } from '@onekeyhq/shared/src/performance/init';

export function GlobalJotaiReady({ children }: { children: any }) {
  if (process.env.NODE_ENV !== 'production') {
    debugLandingLog(
      `GlobalJotaiReady render, isReady=${globalJotaiStorageReadyHandler.isReady}`,
    );
  }
  const [isReady, setIsReady] = useState(
    () => globalJotaiStorageReadyHandler.isReady,
  );

  useEffect(() => {
    if (globalJotaiStorageReadyHandler.isReady) {
      setIsReady(true);
      return;
    }
    let isMounted = true;
    void globalJotaiStorageReadyHandler.ready.then((ready) => {
      if (!isMounted) return;
      if (process.env.NODE_ENV !== 'production') {
        debugLandingLog('GlobalJotaiReady resolved', `ready=${ready}`);
      }
      startTransition(() => {
        setIsReady(ready);
      });
    });
    return () => {
      isMounted = false;
    };
  }, []);

  if (!isReady) {
    return <View testID="GlobalJotaiReady-not-ready-placeholder" />;
  }

  return children as JSX.Element;
}
