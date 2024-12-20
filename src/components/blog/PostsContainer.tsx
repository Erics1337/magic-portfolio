import { getBlogPosts } from '@/app/utils/utils';
import { Posts } from './Posts';

interface PostsContainerProps {
    range?: [number] | [number, number];
    columns?: '1' | '2' | '3';
    locale: string;
    thumbnail?: boolean;
}

export async function PostsContainer(props: PostsContainerProps) {
    const allBlogs = await getBlogPosts(props.locale);
    
    const sortedBlogs = [...allBlogs].sort((a, b) => {
        return new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime();
    });

    return <Posts {...props} blogs={sortedBlogs} />;
}
