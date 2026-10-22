import { projectCatalog } from '@/asset/data/projectCatalog';

export const projectStats = {
    total: projectCatalog.length,
    personal: projectCatalog.filter((project) => project.projectType === 'SIDE').length,
    work: projectCatalog.filter((project) => project.projectType === 'WORK').length,
    technologies: ['React', 'Vue', 'TypeScript'].map((name) => ({
        name,
        count: projectCatalog.filter((project) => project.techStack.some((tech) => tech.toLowerCase() === name.toLowerCase())).length,
    })),
};
