'use client';

import dynamic from 'next/dynamic';
import SceneLoading from './portfolio3d/components/SceneLoading';

const PortfolioWorld = dynamic(() => import('./portfolio3d/PortfolioWorld'), {
    ssr: false,
    loading: () => <SceneLoading scene="village" />,
});

export default function Home() {
    return (
        <main className="fixed inset-0 h-dvh w-full overflow-hidden">
            <PortfolioWorld />
        </main>
    );
}
