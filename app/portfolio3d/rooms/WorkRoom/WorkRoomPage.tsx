'use client';

import { lazy, Suspense, useEffect, useState } from 'react';
import { projectCatalog } from '@/asset/data/projectCatalog';
import RoomScene from '../../scene/RoomScene';
import WorkRoom from './WorkRoom';
import WorkRoomBoundary from './WorkRoomBoundary';
import useMobile from '../../useMobile';
import styles from './WorkRoom.module.css';

const ProjectDetail = lazy(() => import('./WorkProjectDetail'));
const start: [number, number, number] = [0, 1.35, 2.35];
const lookAt: [number, number, number] = [0, 1.35, -3];
const exit: [number, number, number] = [0, 0, 3.15];
const bounds = { minX: -4.1, maxX: 4.1, minZ: -2.75, maxZ: 2.85 };

export default function WorkRoomPage({ onBack }: { onBack: () => void }) {
    return <WorkRoomBoundary onBack={onBack}><WorkRoomContent onBack={onBack} /></WorkRoomBoundary>;
}

function WorkRoomContent({ onBack }: { onBack: () => void }) {
    const mobile = useMobile();
    const [selected, setSelected] = useState<number | null>(null);
    useEffect(() => () => { document.body.style.cursor = ''; }, []);
    return (
        <RoomScene
            loadingScene="work"
            lightweight onBack={onBack} startPosition={start} lookAt={lookAt}
            exitPosition={exit} bounds={bounds}
            overlay={
                <>
                    <details className={`absolute ${mobile ? styles.mobileProjectList : 'bottom-5 left-5 max-w-[calc(100vw-40px)]'} z-20 rounded-2xl border-2 border-[#725640] bg-[#fffdf8] px-4 py-3 text-sm text-[#725640] shadow-md`}>
                        <summary className="cursor-pointer font-bold">프로젝트 목록</summary>
                        <nav aria-label="프로젝트 선택" className="mt-3 grid max-h-[40dvh] gap-1 overflow-y-auto">
                            {projectCatalog.map((project, index) => (
                                <button key={project.title} type="button" onClick={() => setSelected(index)} className="rounded-lg px-2 py-2 text-left text-xs hover:bg-pink-50 focus-visible:outline-2">
                                    {String(index + 1).padStart(2, '0')} · {project.title}
                                </button>
                            ))}
                        </nav>
                    </details>
                    {selected !== null && (
                        <Suspense fallback={<div className="absolute inset-0 z-30 grid place-items-center bg-white/70 text-sm text-[#725640]">프로젝트를 불러오는 중…</div>}>
                            <ProjectDetail index={selected} onClose={() => setSelected(null)} />
                        </Suspense>
                    )}
                </>
            }
        >
            <WorkRoom onSelect={setSelected} />
        </RoomScene>
    );
}
