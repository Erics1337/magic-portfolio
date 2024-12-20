import { getWorkProjects } from '@/app/utils/utils';
import { Projects } from './Projects';

interface ProjectsContainerProps {
    range?: [number, number?];
    locale: string;
}

export async function ProjectsContainer(props: ProjectsContainerProps) {
    const allProjects = await getWorkProjects(props.locale);
    
    const sortedProjects = [...allProjects].sort((a, b) => {
        return new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime();
    });

    return <Projects {...props} posts={sortedProjects} />;
}
