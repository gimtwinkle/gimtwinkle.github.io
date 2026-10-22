export const sceneLoadingMessages: Record<string, string> = {
    village: '마을 진입중..',
    about: 'twinkle의 방으로 들어가는 중...',
    work: '공장으로 들어가는 중..',
    skills: '우주로 들어가는 중..',
    contact: '우체국 입장중 ..',
};

export default function SceneLoading({ scene }: { scene: string }) {
    return (
        <div role="status" className="fixed inset-0 z-[10002] flex items-center justify-center bg-black text-sm text-white/80">
            {sceneLoadingMessages[scene] ?? '방으로 들어가는 중..'}
        </div>
    );
}
