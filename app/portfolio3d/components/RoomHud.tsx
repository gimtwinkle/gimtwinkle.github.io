'use client';

import { useEffect, useState } from 'react';
import { isSeoulNight } from '@/lib/seoulDaylight';

const clockFormat = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Seoul', hour: 'numeric', minute: '2-digit', hour12: true,
});

const roomDetails: Record<string, { name: string; technologies: string[]; controls: string[] }> = {
    village: { name: 'TWINKLE VILLAGE', technologies: ['Next.js', 'TypeScript', 'Three.js', 'React Three Fiber', 'Drei'], controls: ['캐릭터 이동 : 방향키, wasd', '방 입장 : 집 클릭', '시점 회전 : 드래그'] },
    about: { name: 'About', technologies: ['Next.js', 'TypeScript', 'Three.js', 'React Three Fiber', 'Drei', 'glTF'], controls: ['WASD / 방향키 · 이동', '드래그 · 둘러보기 / 휠 · 앞뒤 이동', '물건에 마우스 올리기 · 이야기 보기'] },
    work: { name: 'Work', technologies: ['Next.js', 'TypeScript', 'Three.js', 'React Three Fiber', 'Drei', 'CSS Modules'], controls: ['WASD / 방향키 · 이동', '드래그 · 둘러보기 / 휠 · 앞뒤 이동', '박스 클릭 · 프로젝트 / 캔디머신 클릭 · 랜덤뽑기'] },
    skills: { name: 'Skills', technologies: ['Next.js', 'TypeScript', 'Three.js', 'React Three Fiber', 'Drei', 'Lottie', 'GLSL', 'CSS Modules'], controls: ['휠 / 위아래 스와이프 · 우주 탐색', '카드 위에서도 스크롤할 수 있어요.', '관련 프로젝트 클릭 · 목록 펼치기'] },
    contact: { name: 'Contact', technologies: ['Next.js', 'TypeScript', 'Three.js', 'React Three Fiber', 'Drei', 'CSS Modules', 'GitHub API'], controls: ['이동 : 방향키, wasd / 시점 회전 : 드래그', '개인 편지 : 핑크 우체통 클릭', '공개 방명록 : 방명록 데스크 클릭'] },
};

const roomDescriptions: Record<string, { title: string; steps: { icon: string; title: string; text: string }[] }> = {
    contact: {
        title: 'TWINKLE POST OFFICE',
        steps: [
            { icon: '✉️', title: 'twinkle에게 편지를 보내 주세요!', text: '핑크 우체통을 클릭하면 편지를 쓸 수 있어요. 메일 앱에서 내용을 확인하고 전송해 주세요.' },
            { icon: '📖', title: '마을에 작은 발자국을 남겨 주세요.', text: '방명록 데스크를 클릭해 인사를 적어 보세요. GitHub에서 등록을 완료하면 다른 방문자도 볼 수 있어요!' },
        ],
    },
    about: {
        title: 'TWINKLE ROOM',
        steps: [
            { icon: '🏡', title: 'twinkle의 방에 오신 걸 환영해요!', text: 'twinkle을 잘 보여주는 물건들로 가득한 twinkle room입니다.' },
            { icon: '🔎', title: '물건 속에 담긴 twinkle을 만나보세요!', text: '궁금한 가구나 물건에 마우스를 올려 보세요. 가까이 가지 않아도 twinkle의 이야기를 만날 수 있어요!' },
        ],
    },
    village: {
        title: 'TWINKLE VILLAGE',
        steps: [
            { icon: '🎮', title: '마을을 자유롭게 둘러보세요!', text: '방향키 또는 W·A·S·D로 캐릭터를 움직일 수 있어요.' },
            { icon: '🖱️', title: '원하는 방으로 바로 이동해 보세요!', text: '걸음이 느려 답답하다면, 가고 싶은 방의 집을 마우스로 클릭해 바로 들어가 보세요!' },
        ],
    },
    work: {
        title: 'WORK ROOM',
        steps: [
            { icon: '📦', title: '박스 안에 어떤 프로젝트가 있을까요?', text: '움직이는 박스를 클릭하면 프로젝트에 대한 설명을 볼 수 있어요.' },
            { icon: '🍬', title: '고르기 어렵다면 랜덤뽑기!', text: '캔디머신을 클릭해 보세요. 프로젝트를 무작위로 보여줍니다!' },
        ],
    },
    skills: {
        title: 'SKILL ROOM',
        steps: [
            { icon: '✨', title: '스크롤하며 스킬을 발견해 보세요!', text: '스크롤하면 스킬 내용을 차례로 확인할 수 있어요. 모바일에서는 위아래로 쓸어 넘겨 보세요.' },
        ],
    },
};

function RoomTutorial({ description }: { description: (typeof roomDescriptions)[string] }) {
    const [step, setStep] = useState(0);
    const [open, setOpen] = useState(true);
    const current = description.steps[step];
    const buttonClass = 'rounded-lg border-2 border-[#654733] px-3 py-2 text-xs font-bold transition hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#654733]';

    if (!open) return (
        <button type="button" onClick={() => { setStep(0); setOpen(true); }} className={`pointer-events-auto bg-[#fff6d8] text-[#543a2b] shadow-[3px_3px_0_#654733] ${buttonClass}`}>
            ? 튜토리얼 다시 보기
        </button>
    );

    return (
        <aside aria-label={`${description.title} 튜토리얼`} onKeyDown={(event) => event.stopPropagation()} onKeyUp={(event) => event.stopPropagation()}
            className="pointer-events-auto max-h-[calc(100dvh-232px)] w-[360px] max-w-[calc(100vw-48px)] overflow-y-auto overscroll-contain rounded-2xl border-[3px] border-[#654733] bg-[#fffaf0] p-4 text-[#543a2b] shadow-[5px_5px_0_#654733] sm:max-h-[calc(100dvh-168px)]">
            <div className="mb-4 flex items-center justify-between gap-3 border-b-2 border-dashed border-[#dfcbb1] pb-3">
                <span className="text-[10px] font-black tracking-widest">{description.title} · TUTORIAL</span>
                <button type="button" aria-label="튜토리얼 닫기" onClick={() => setOpen(false)} className="rounded px-2 text-lg leading-none hover:bg-[#f5e4cb] focus-visible:outline-2">×</button>
            </div>
            <div className="flex items-start gap-3">
                <div aria-hidden="true" className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border-2 border-[#654733] bg-[#ffe6a3] text-2xl shadow-[2px_2px_0_#c89e6e]">{current.icon}</div>
                <div aria-live="polite" aria-atomic="true" className="min-w-0">
                    <p className="mb-1 text-[10px] font-bold tracking-widest text-[#a16d43]">TWINKLE GUIDE</p>
                    <h2 className="text-sm font-black leading-relaxed">{current.title}</h2>
                    <p className="mt-2 text-xs leading-6">{current.text}</p>
                </div>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2">
                <span aria-label={`${description.steps.length}단계 중 ${step + 1}단계`} className="text-xs font-bold tabular-nums">{String(step + 1).padStart(2, '0')} / {String(description.steps.length).padStart(2, '0')}</span>
                <div className="flex gap-2">
                    {step > 0 && <button type="button" className={`${buttonClass} bg-white`} onClick={() => setStep(step - 1)}>이전</button>}
                    <button type="button" className={`${buttonClass} bg-[#ffd982] shadow-[2px_2px_0_#654733]`}
                        onClick={() => step < description.steps.length - 1 ? setStep(step + 1) : setOpen(false)}>
                        {step < description.steps.length - 1 ? '다음 →' : '알겠어요!'}
                    </button>
                </div>
            </div>
        </aside>
    );
}

export default function RoomHud({ onBack, room }: { onBack?: () => void; room?: string }) {
    const [now, setNow] = useState(() => new Date());
    useEffect(() => {
        const timer = window.setInterval(() => setNow(new Date()), 1000);
        return () => window.clearInterval(timer);
    }, []);
    const isNight = isSeoulNight(now);
    const description = room ? roomDescriptions[room] : undefined;
    const details = room ? roomDetails[room] : undefined;
    return (
        <>
        <div className="pointer-events-none fixed left-6 top-6 z-[10001] flex flex-col items-start gap-3">
            {onBack ? (
                <button
                    type="button" onClick={onBack} aria-label="마을로 돌아가기"
                    className="pointer-events-auto rounded-full border border-white/30 bg-black/40 px-5 py-3 text-sm font-bold text-white shadow-lg backdrop-blur-md transition hover:scale-105 hover:bg-black/60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                >
                    ← VILLAGE
                </button>
            ) : <div className="h-11" />}
            <div aria-label="서울 현재 시간" className="rounded-xl border-2 border-white/30 bg-black/45 px-4 py-3 text-sm font-bold text-white backdrop-blur-md">
                <span className="mr-2" role="img" aria-label={isNight ? '밤' : '낮'}>{isNight ? '🌙' : '☀️'}</span>
                <time dateTime={now.toISOString()} suppressHydrationWarning>{clockFormat.format(now)}</time>
            </div>
            {description && <div className="mt-16 sm:mt-0"><RoomTutorial key={room} description={description} /></div>}
        </div>
        {details && (
            <aside aria-label="현재 위치와 사용 기술, 조작 안내" className="pointer-events-auto fixed right-6 top-6 z-[10001] max-h-44 w-[400px] max-w-[calc(100vw-208px)] overflow-y-auto overscroll-contain rounded-xl border border-white/40 bg-black/65 px-3 py-3 text-white shadow-lg backdrop-blur-md sm:pointer-events-none sm:max-h-none sm:px-4">
                <p className="text-[10px] leading-relaxed text-white/80 sm:text-xs">
                    <strong className="font-bold text-white">{details.name}</strong>은{' '}
                    <span><strong className="font-bold text-white">{details.technologies.join(', ')}</strong>로 만들어졌어요!</span>
                </p>
                <div className="mt-2 space-y-1 border-t border-white/20 pt-2 text-[10px] leading-relaxed text-white/90 sm:text-xs">
                    <p className="font-bold text-white">조작방법</p>
                    {details.controls.map((control) => <p key={control}>{control}</p>)}
                </div>
            </aside>
        )}
        </>
    );
}
