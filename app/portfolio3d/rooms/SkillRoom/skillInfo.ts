import { projectCatalog as projects } from '@/asset/data/projectCatalog';

export type SkillInfo = {
    name: string;
    category: string;
    level: 1 | 2 | 3 | 4 | 5 | null;
    description: string;
    color: string;
    projects: { title: string; href: string }[];
};

export const levelNames = ['입문', '기초 활용', '독립 구현', '설계·최적화', '깊은 전문성'];

const related = (tag: string) => projects
    .filter((project) => project.techStack.some((tech) => tech.toLowerCase() === tag.toLowerCase()))
    .map(({ title, href }) => ({ title, href }));

export const skillInfo: Record<string, SkillInfo> = {
    react: {
        name: 'React', category: 'FRONTEND', level: 4, color: '#7bdfff',
        description: '컴포넌트 기반 UI와 서비스 화면을 설계하고 구현합니다.',
        projects: related('React'),
    },
    next: {
        name: 'Next.js', category: 'FRONTEND', level: 4, color: '#e4e9ff',
        description: 'React 기반 웹 서비스의 페이지 구조와 사용자 흐름을 구현합니다.',
        projects: related('nextjs'),
    },
    typescript: {
        name: 'TypeScript', category: 'FRONTEND', level: 3, color: '#87baff',
        description: '타입을 활용해 컴포넌트와 데이터 흐름을 명확하게 구현합니다.',
        projects: related('TypeScript'),
    },
    figma: {
        name: 'Figma', category: 'DESIGN', level: null, color: '#ffb6de',
        description: '디자인과 개발 사이의 화면 구성과 UI 협업 도구입니다.',
        projects: [],
    },
    git: {
        name: 'Git', category: 'COLLABORATION', level: 5, color: '#ffa68c',
        description: '변경 이력과 브랜치를 관리하며 협업 흐름을 이어갑니다.',
        projects: [],
    },
    github: {
        name: 'GitHub', category: 'COLLABORATION', level: 5, color: '#ceb5ff',
        description: '코드 공유와 변경 이력 관리로 팀의 개발 협업을 지원합니다.',
        projects: related('GitHub'),
    },
    lottie: {
        name: 'Lottie', category: 'MOTION', level: 3, color: '#89f2dc',
        description: '가벼운 벡터 애니메이션을 웹 인터페이스에 연결합니다.',
        projects: [{ title: '지금 탐험 중인 포트폴리오', href: '/' }],
    },
    interaction: {
        name: 'Interaction', category: 'CREATIVE', level: 4, color: '#a6aaff',
        description: '스크롤과 포인터에 반응하는 인터랙티브 경험을 설계합니다.',
        projects: [{ title: '지금 탐험 중인 포트폴리오', href: '/' }],
    },
    accessibility: {
        name: '웹 접근성', category: 'ACCESSIBILITY', level: 5, color: '#ffe5a0',
        description: '다양한 사용자가 이용할 수 있는 UI와 접근성을 구현합니다.',
        projects: projects.filter(({ title }) => title === '우리WON뱅킹 APP')
            .map(({ title, href }) => ({ title, href })),
    },
};
