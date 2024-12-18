'use client';

import { Grid } from '@/once-ui/components';
import Post from './Post';

interface PostsProps {
    range?: [number] | [number, number];
    columns?: '1' | '2' | '3';
    locale: string;
    thumbnail?: boolean;
    blogs: any[];
}

export function Posts({
    range,
    columns = '1',
    locale = 'en',
    thumbnail = false,
    blogs
}: PostsProps) {
    const displayedBlogs = range
        ? blogs.slice(
              range[0] - 1,
              range.length === 2 ? range[1] : blogs.length 
          )
        : blogs;

    return (
        <>
            {displayedBlogs.length > 0 && (
                <Grid
                    columns={`repeat(${columns}, 1fr)`} mobileColumns="1col"
                    fillWidth marginBottom="40" gap="m">
                    {displayedBlogs.map((post) => (
                        <Post
                            key={post.slug}
                            post={post}
                            thumbnail={thumbnail}
                        />
                    ))}
                </Grid>
            )}
        </>
    );
}