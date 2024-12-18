'use client';

import { Flex } from '@/once-ui/components';
import { ProjectCard } from '@/components';

interface ProjectsProps {
    range?: [number, number?];
    locale: string;
    posts: any[];
}

export function Projects({ range, locale, posts }: ProjectsProps) {
    const displayedProjects = range
        ? posts.slice(range[0] - 1, range[1] ?? posts.length)
        : posts;

    return (
        <Flex direction="column" gap="8">
            {displayedProjects.map((project, idx) => (
                <ProjectCard
                    key={idx}
                    href={`/${locale}/work/${project.slug}`}
                    title={project.metadata.title}
                    description={project.metadata.summary}
                    images={project.metadata.images || []}
                    content={project.content}
                    tags={project.metadata.tags || []}
                    avatars={(project.metadata.team || []).map(member => ({ src: member.avatar }))}
                />
            ))}
        </Flex>
    );
}