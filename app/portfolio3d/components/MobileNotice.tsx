'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import styles from './MobileNotice.module.css';

const query = '(max-width: 767px), (hover: none) and (pointer: coarse)';
const subscribe = (listener: () => void) => {
    const media = window.matchMedia(query);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
};
const getSnapshot = () => window.matchMedia(query).matches;
const getServerSnapshot = () => false;

export default function MobileNotice() {
    const mobile = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
    const [phase, setPhase] = useState<'visible' | 'fading' | 'hidden'>('visible');

    useEffect(() => {
        if (!mobile) return;
        const fade = window.setTimeout(() => setPhase('fading'), 3200);
        const hide = window.setTimeout(() => setPhase('hidden'), 3650);
        return () => { window.clearTimeout(fade); window.clearTimeout(hide); };
    }, [mobile]);

    if (!mobile || phase === 'hidden') return null;

    return <div className={`${styles.overlay} ${phase === 'fading' ? styles.fading : ''}`}>
        <div className={styles.card} role="status" aria-live="polite">
            <span className={styles.icon} aria-hidden="true">✦</span>
            <p className={styles.title}>모바일 화면을 준비하고 있어요</p>
            <p className={styles.message}>현재 모바일 최적화 중으로,<br />PC 버전 화면이 그대로 표시됩니다.</p>
            <span className={styles.hint}>잠시 후 마을로 이동해요</span>
        </div>
    </div>;
}
