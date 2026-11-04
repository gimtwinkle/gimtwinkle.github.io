'use client';

import styles from './PinchZoomHint.module.css';

export default function PinchZoomHint() {
    return (
        <div className={styles.overlay} role="note" aria-label="두 손가락으로 화면을 벌리거나 오므려 확대하거나 축소할 수 있습니다">
            <svg className={styles.gesture} viewBox="0 0 96 64" aria-hidden="true">
                <path className={styles.leftFinger} d="M25 54V28a8 8 0 0 1 16 0v26z" />
                <path className={styles.rightFinger} d="M55 54V28a8 8 0 0 1 16 0v26z" />
                <path className={styles.arrow} d="M20 14l-6 5 6 5m56-10 6 5-6 5" />
            </svg>
            <strong>두 손가락으로 확대·축소</strong>
            <span>화면을 벌리거나 오므려 보세요</span>
        </div>
    );
}
