'use client';

import { Component, type ReactNode } from 'react';

export default class WorkRoomBoundary extends Component<{
    children: ReactNode;
    onBack: () => void;
}, { error: string | null }> {
    state: { error: string | null } = { error: null };

    static getDerivedStateFromError(error: Error) {
        return { error: error.message || '알 수 없는 렌더링 오류' };
    }

    render() {
        if (!this.state.error) return this.props.children;
        return (
            <div role="alert" className="fixed inset-0 z-[10000] grid place-items-center bg-[#fff7ed] p-6 text-[#6b4328]">
                <div className="max-w-md space-y-4 rounded-2xl bg-white p-6 shadow-lg">
                    <h2 className="text-lg font-bold">워크룸 화면을 표시할 수 없어요</h2>
                    <p className="break-words text-sm">{this.state.error}</p>
                    <div className="flex gap-4">
                        <button type="button" onClick={() => this.setState({ error: null })}>다시 시도</button>
                        <button type="button" onClick={this.props.onBack}>마을로 돌아가기</button>
                    </div>
                </div>
            </div>
        );
    }
}
