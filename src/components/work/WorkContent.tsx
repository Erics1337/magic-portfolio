"use client";

import { Flex, Select } from '@/once-ui/components';
import { Projects } from '@/components/work/Projects';
import { useState, useMemo } from 'react';

interface WorkContentProps {
    posts: any[];
    locale: string;
}

export function WorkContent({ posts, locale }: WorkContentProps) {
    const [selectedTag, setSelectedTag] = useState<string>('all');
    
    // Get unique tags from all posts
    const allTags = useMemo(() => {
        const tags = new Set<string>();
        tags.add('all');
        posts.forEach(post => {
            if (post.metadata?.tags && Array.isArray(post.metadata.tags)) {
                post.metadata.tags.forEach((tag: string) => tags.add(tag));
            }
        });
        return Array.from(tags);
    }, [posts]);

    // console.log('Available tags:', allTags);

    // Filter posts based on selected tag
    const filteredPosts = useMemo(() => {
        if (selectedTag === 'all') return posts;
        return posts.filter(post => 
            post.metadata?.tags && 
            Array.isArray(post.metadata.tags) && 
            post.metadata.tags.includes(selectedTag)
        );
    }, [posts, selectedTag]);

    const tagOptions = allTags.map(tag => ({
        label: tag,
        value: tag
    }));

    // console.log('Tag options:', tagOptions);

    return (
        <Flex direction="column" gap="48">
            <div style={{ position: 'relative', zIndex: 10, maxWidth: '200px' }}>
                <Select
                    id="tag-filter"
                    label="Filter by tag"
                    value={selectedTag}
                    onSelect={(option) => setSelectedTag(option.value)}
                    options={tagOptions}
                    placeholder="Filter by tag"
                />
            </div>
            <Projects posts={filteredPosts} locale={locale} />
        </Flex>
    );
}
