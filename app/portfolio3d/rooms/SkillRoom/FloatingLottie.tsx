'use client';

import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import Lottie, { type LottieRefCurrentProps } from 'lottie-react';
import { useEffect, useId, useRef, type CSSProperties } from 'react';
import { MathUtils, Vector3, type Group } from 'three';
import { levelNames, type SkillInfo } from './skillInfo';
import styles from './SkillDetails.module.css';

export type FloatingLottieProps = {
    animationData: object;
    position: [number, number, number];
    size?: number;
    floatSpeed?: number;
    floatAmount?: number;
    delay?: number;
    distanceFactor?: number;
    glowColor?: string;
    cycleDuration?: number;
    hologramOpacity?: number;
    emphasizeCenter?: boolean;
    skill?: SkillInfo;
};

export default function FloatingLottie({
    animationData, position, size = 90, floatSpeed = 0.35,
    floatAmount = 0.07, delay = 0, distanceFactor = 4, hologramOpacity = 1,
    emphasizeCenter = false, skill,
}: FloatingLottieProps) {
    const groupRef = useRef<Group>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const projectsRef = useRef<HTMLDetailsElement>(null);
    const animationRef = useRef<LottieRefCurrentProps | null>(null);
    const playing = useRef<boolean | null>(null);
    const projected = useRef(new Vector3());
    const emphasis = useRef(0);
    const offset = useRef({ x: 0, y: 0 });
    const bounds = useRef({ width: 640, height: 300 });
    const interactive = useRef(false);
    const projectsId = useId();

    useEffect(() => {
        const card = cardRef.current;
        if (!card) return;
        const measure = () => { bounds.current = { width: card.offsetWidth, height: card.offsetHeight }; };
        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(card);
        return () => observer.disconnect();
    }, []);

    useFrame(({ clock, camera, size: viewport }, delta) => {
        if (!groupRef.current || !cardRef.current) return;
        groupRef.current.position.y = position[1] + Math.sin(clock.elapsedTime * floatSpeed + delay) * floatAmount;
        if (!emphasizeCenter) return;
        const dt = Math.min(delta, 0.05);
        const point = groupRef.current.getWorldPosition(projected.current);
        const distance = Math.max(0.01, point.distanceTo(camera.position));
        point.project(camera);
        const inFront = point.z > -1 && point.z < 1;
        const foreground = 1 - MathUtils.smoothstep(distance, 8, 16);
        const centered = Math.exp(-(point.x * point.x + point.y * point.y) * 5);
        emphasis.current = MathUtils.damp(emphasis.current, inFront ? centered * foreground : 0, 9, dt);
        const reveal = MathUtils.smoothstep(emphasis.current, 0.12, 0.55);
        const passFade = MathUtils.smoothstep(distance, 2.5, 5);
        const visible = inFront && distance < 35;
        const active = visible && reveal * passFade > 0.35;
        const card = cardRef.current;
        card.style.setProperty('--card-top-alpha', String(0.5 + reveal * 0.25));
        card.style.setProperty('--card-bottom-alpha', String(0.4 + reveal * 0.25));
        card.style.opacity = String(visible ? hologramOpacity * (0.25 + emphasis.current * 0.75) * passFade * (1 - MathUtils.smoothstep(distance, 26, 35)) : 0);
        if (interactive.current !== active) {
            card.inert = !active;
            card.setAttribute('aria-hidden', String(!active));
            card.style.pointerEvents = active ? 'auto' : 'none';
            interactive.current = active;
            if (!active && projectsRef.current) projectsRef.current.open = false;
        }
        const shouldPlay = visible && distance < 20 && Math.abs(point.x) < 1.2 && Math.abs(point.y) < 1.2;
        if (animationRef.current?.animationLoaded && playing.current !== shouldPlay) {
            if (shouldPlay) animationRef.current.play();
            else animationRef.current.pause();
            playing.current = shouldPlay;
        }
        // Invisible cards need no layout calculation or CSS transform updates.
        if (!visible) return;
        // Position and scale the whole card together so its contents cannot drift apart.
        const topInset = 148;
        const bottomInset = 54;
        const availableHeight = Math.max(80, viewport.height - topInset - bottomInset);
        const scale = Math.min(MathUtils.lerp(MathUtils.clamp(distanceFactor / distance, 0.25, 1), 1, reveal),
            (viewport.width - 32) / bounds.current.width, availableHeight / bounds.current.height);
        const halfWidth = bounds.current.width * scale / 2;
        const halfHeight = bounds.current.height * scale / 2;
        const screenX = (point.x + 1) * viewport.width / 2;
        const screenY = (1 - point.y) * viewport.height / 2;
        const centerX = MathUtils.clamp(viewport.width / 2, halfWidth + 16, viewport.width - halfWidth - 16);
        const centerY = MathUtils.clamp(viewport.height / 2, topInset + halfHeight, viewport.height - bottomInset - halfHeight);
        offset.current.x = MathUtils.damp(offset.current.x, (centerX - screenX) * reveal, 12, dt);
        offset.current.y = MathUtils.damp(offset.current.y, (centerY - screenY) * reveal, 12, dt);
        card.style.transform = 'translate(' + offset.current.x + 'px, ' + offset.current.y + 'px) scale(' + scale + ')';
    });

    return (
        <group ref={groupRef} position={position}>
            <Html center zIndexRange={[25, 1]} style={{ pointerEvents: 'none', userSelect: 'none' }}>
                <div ref={cardRef} className={styles.skill}
                    style={{ '--skill-color': skill?.color ?? '#b7caff', opacity: emphasizeCenter ? 0 : hologramOpacity } as CSSProperties}
                    aria-hidden={emphasizeCenter} inert={emphasizeCenter}>
                    <div className={styles.artwork}>
                        <button type="button" className={styles.logo} style={{ width: size, height: size }}
                            disabled={!skill?.projects.length}
                            aria-label={skill ? `${skill.name} 관련 프로젝트 보기` : '기술 로고'}
                            aria-controls={skill?.projects.length ? projectsId : undefined}
                            onClick={() => { if (projectsRef.current) projectsRef.current.open = !projectsRef.current.open; }}>
                            <Lottie lottieRef={animationRef} onDOMLoaded={() => { animationRef.current?.setSubframe(false); playing.current = null; }}
                                animationData={animationData} loop autoplay={!emphasizeCenter} aria-hidden="true"
                                rendererSettings={{ preserveAspectRatio: 'xMidYMid meet' }} style={{ width: '100%', height: '100%' }} />
                        </button>
                    </div>
                    {skill && <div className={styles.content}>
                        <span className={styles.category}>{skill.category}</span>
                        <h2 className={styles.name}>{skill.name}</h2>
                        <div className={styles.stars} role="img" aria-label={skill.level ? `숙련도 5단계 중 ${skill.level}단계` : '숙련도 미설정'}>
                            {Array.from({ length: 5 }, (_, index) => <span key={index} aria-hidden="true" className={index < (skill.level ?? 0) ? styles.lit : styles.dim}>★</span>)}
                        </div>
                        <p className={styles.level}>{skill.level ? `${skill.level} / 5 · ${levelNames[skill.level - 1]}` : '레벨 설정 전'}</p>
                        <p className={styles.description}>{skill.description}</p>
                        {skill.projects.length ? <details ref={projectsRef} id={projectsId} className={styles.projects}>
                            <summary>관련 프로젝트 · {skill.projects.length}</summary>
                            <div data-skill-details className={styles.projectList}>
                                {skill.projects.map((project) => <a key={project.title} href={project.href} target="_blank" rel="noopener noreferrer" aria-label={`${project.title} (새 탭)`}>{project.title} ↗</a>)}
                            </div>
                        </details> : <p className={styles.empty}>관련 프로젝트 준비 중</p>}
                    </div>}
                </div>
            </Html>
        </group>
    );
}
