import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import { getLastSyncTime } from './cache';

let NetInfo = null;
try {
  NetInfo = require('@react-native-community/netinfo').default;
} catch (e) {
  // NetInfo non disponible (web sans support)
}

export function useNetworkStatus() {
  const [isConnected, setIsConnected] = useState(true);
  const [lastSyncTime, setLastSyncTime] = useState(null);

  useEffect(() => {
    let unsubscribe;

    if (NetInfo) {
      unsubscribe = NetInfo.addEventListener((state) => {
        setIsConnected(state.isConnected ?? true);
      });
    } else if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const handleOnline = () => setIsConnected(true);
      const handleOffline = () => setIsConnected(false);
      setIsConnected(navigator.onLine);
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      unsubscribe = () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }

    getLastSyncTime().then(setLastSyncTime);

    return () => { if (unsubscribe) unsubscribe(); };
  }, []);

  const updateLastSync = useCallback(() => {
    setLastSyncTime(Date.now());
  }, []);

  return { isConnected, lastSyncTime, updateLastSync };
}
