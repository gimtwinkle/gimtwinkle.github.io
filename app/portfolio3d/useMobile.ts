'use client';

import { useSyncExternalStore } from 'react';

export const mobileQuery = '(max-width: 767px), (any-pointer: coarse)';
const subscribe = (callback: () => void) => {
    const query = window.matchMedia(mobileQuery);
    query.addEventListener('change', callback);
    return () => query.removeEventListener('change', callback);
};
const snapshot = () => window.matchMedia(mobileQuery).matches;
const serverSnapshot = () => false;

export default function useMobile() {
    return useSyncExternalStore(subscribe, snapshot, serverSnapshot);
}
