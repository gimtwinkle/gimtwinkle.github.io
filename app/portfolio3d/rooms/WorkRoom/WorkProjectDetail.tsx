'use client';

import { projects } from '@/asset/data/projects';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from './WorkRoom.module.css';

export default function WorkProjectDetail({ index, onClose }: { index: number; onClose: () => void }) {
    const ref = useRef<HTMLDialogElement>(null);
    const project = projects[index];
    useEffect(() => {
        const dialog = ref.current;
        const previous = document.activeElement as HTMLElement | null;
        dialog?.showModal();
        return () => { dialog?.close(); previous?.focus(); };
    }, []);

    return createPortal(
        <dialog
            ref={ref} className={styles.dialog} aria-labelledby="work-project-title"
            onCancel={(event) => { event.preventDefault(); onClose(); }}
            onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
            onKeyDown={(event) => event.stopPropagation()}
            onKeyUp={(event) => event.stopPropagation()}
        >
            <article className={styles.project}>
                <header className={styles.projectHeader}>
                    <span>PROJECT FILE / {String(index + 1).padStart(2, '0')}</span>
                    <button type="button" onClick={onClose} aria-label="프로젝트 상세 닫기">닫기 ×</button>
                </header>
                <div className={styles.projectBody}>
                    <div className={styles.projectInfo}>
                        <span className={styles.category}>{project.projectType} / {project.date}</span>
                        <h2 id="work-project-title">{project.title}</h2>
                        <p className={styles.company}>{project.company}</p>
                        <p className={styles.description}>{project.desc}</p>
                        <ul className={styles.tags} aria-label="사용 기술">
                            {project.techStack.map((tech) => <li key={tech}>{tech}</li>)}
                        </ul>
                        <a className={styles.visit} href={project.href} target="_blank" rel="noopener noreferrer">프로젝트 사이트 보기 <span aria-hidden="true">↗</span><span className={styles.srOnly}> (새 탭)</span></a>
                    </div>
                    <div className={styles.preview}>
                        <Image src={project.src} alt={`${project.title} 화면 미리보기`} sizes="(max-width: 700px) 90vw, 55vw" className={styles.previewImage} />
                    </div>
                </div>
                <footer className={styles.projectFooter}><span>TWINKLE / SELECTED WORKS</span><span>DESIGN & DEVELOPMENT</span></footer>
            </article>
        </dialog>, document.body,
    );
}
