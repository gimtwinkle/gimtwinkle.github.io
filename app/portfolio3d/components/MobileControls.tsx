'use client';

import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type PointerEvent } from 'react';
import { resetMovement, setJoystick } from '../movement';
import styles from './MobileControls.module.css';

const subscribeTouch = (listener: () => void) => {
    const query = window.matchMedia('(any-pointer: coarse)');
    query.addEventListener('change', listener);
    return () => query.removeEventListener('change', listener);
};
const touchSnapshot = () => window.matchMedia('(any-pointer: coarse)').matches;
const serverSnapshot = () => false;

export default function MobileControls({ walking }: { walking: boolean }) {
    const touchScreen = useSyncExternalStore(subscribeTouch, touchSnapshot, serverSnapshot);
    const knob = useRef<HTMLSpanElement>(null);
    const pointer = useRef<number | null>(null);
    const [orientationHelp, setOrientationHelp] = useState('휴대폰을 가로로 돌려 주세요. 화면 회전 잠금도 해제해 주세요.');
    const release = useCallback(() => {
        pointer.current = null;
        setJoystick(0, 0);
        if (knob.current) knob.current.style.transform = 'translate(0px, 0px)';
    }, []);

    useEffect(() => {
        const resize = () => { release(); resetMovement(); };
        window.addEventListener('blur', release);
        window.addEventListener('resize', resize);
        return () => {
            window.removeEventListener('blur', release);
            window.removeEventListener('resize', resize);
            release();
        };
    }, [release]);

    const move = (event: PointerEvent<HTMLDivElement>) => {
        if (pointer.current !== event.pointerId) return;
        const rect = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const z = event.clientY - rect.top - rect.height / 2;
        const distance = Math.hypot(x, z);
        const radius = 34;
        const scale = distance > radius ? radius / distance : 1;
        if (knob.current) knob.current.style.transform = `translate(${x * scale}px, ${z * scale}px)`;
        const strength = Math.max(0, Math.min(1, (distance - 6) / (radius - 6)));
        setJoystick(distance ? x / distance * strength : 0, distance ? z / distance * strength : 0);
    };

    const startLandscape = async () => {
        resetMovement();
        try {
            if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
                await document.documentElement.requestFullscreen();
            }
            const orientation = screen.orientation as ScreenOrientation & { lock?: (orientation: 'landscape') => Promise<void> };
            if (orientation?.lock) await orientation.lock('landscape');
        } catch {
            setOrientationHelp('이 브라우저에서는 직접 가로로 돌려 주세요. 휴대폰의 화면 회전 잠금을 해제하면 됩니다.');
        }
    };

    if (!touchScreen) return null;
    return <>
        {touchScreen && <><section className={styles.portraitGate} aria-label="가로 화면 안내">
            <div className={styles.phone} aria-hidden="true">↻</div>
            <h1>가로로 펼쳐지는 twinkle village</h1>
            <p>{orientationHelp}</p>
            <button type="button" onClick={startLandscape}>가로 화면으로 시작</button>
        </section>
        <button type="button" className={styles.fullscreen} onClick={startLandscape}>전체화면</button></>}
        {walking && <div className={styles.joystick} role="group" aria-label="이동 조이스틱" tabIndex={0}
            onPointerDown={(event) => {
                if (pointer.current !== null) return;
                event.preventDefault(); event.stopPropagation();
                pointer.current = event.pointerId;
                event.currentTarget.setPointerCapture(event.pointerId);
                move(event);
            }}
            onPointerMove={(event) => { if (pointer.current === event.pointerId) { event.preventDefault(); event.stopPropagation(); move(event); } }}
            onPointerUp={(event) => { if (pointer.current === event.pointerId) { release(); if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); } }}
            onPointerCancel={release} onLostPointerCapture={release} onBlur={release}>
            <span className={styles.arrows} aria-hidden="true">↑<br />←　→<br />↓</span>
            <span ref={knob} className={styles.knob} aria-hidden="true" />
            <span className={styles.label}>이동</span>
        </div>}
    </>;
}
