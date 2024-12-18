"use client";

import { Flex, Select } from '@/once-ui/components';
import { Posts } from '@/components/blog/Posts';
import { useState, useMemo } from 'react';

interface BlogContentProps {
    posts: any[];
    locale: string;
}

export function BlogContent({ posts, locale }: BlogContentProps) {
    const [selectedTag, setSelectedTag] = useState<string>('all');
    
    // Get unique tags from all posts
    const allTags = useMemo(() => {
        const tags = new Set<string>();
        tags.add('all');
        posts.forEach(post => {
            if (post.metadata?.tags) {
                post.metadata.tags.forEach((tag: string) => tags.add(tag));
            }
        });
        return Array.from(tags);
    }, [posts]);

    // Filter posts based on selected tag
    const filteredPosts = useMemo(() => {
        if (selectedTag === 'all') return posts;
        return posts.filter(post => {
            if (!post.metadata?.tags) return false;
            return post.metadata.tags.includes(selectedTag);
        });
    }, [posts, selectedTag]);

    const tagOptions = allTags.map(tag => ({
        label: tag,
        value: tag
    }));

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
            {filteredPosts.length > 0 && (
                <Flex fillWidth flex={1} direction="column">
                    <Posts blogs={filteredPosts.slice(0, 3)} locale={locale} thumbnail/>
                    <Posts blogs={filteredPosts.slice(3)} columns="2" locale={locale}/>
                </Flex>
            )}
        </Flex>
    );
}
