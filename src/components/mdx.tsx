import { MDXRemote, MDXRemoteProps } from 'next-mdx-remote/rsc';
import React, { ReactNode } from 'react';

import { SmartImage, SmartLink, Text } from '@/once-ui/components';
import { CodeBlock } from '@/once-ui/modules';
import { HeadingLink } from '@/components';
import ArtisticScrollIllustration from '@/components/blog/ArtisticScrollIllustration';

import { TextProps } from '@/once-ui/interfaces';
import { SmartImageProps } from '@/once-ui/components/SmartImage';

type TableProps = {
    data: {
        headers: string[];
        rows: string[][];
    };
};

function Table({ data }: TableProps) {
    const headers = data.headers.map((header, index) => (
        <th key={index}>{header}</th>
    ));
    const rows = data.rows.map((row, index) => (
        <tr key={index}>
        {row.map((cell, cellIndex) => (
            <td key={cellIndex}>{cell}</td>
        ))}
        </tr>
    ));

    return (
        <table>
            <thead>
                <tr>{headers}</tr>
            </thead>
            <tbody>{rows}</tbody>
        </table>
    );
}

type CustomLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
    children: ReactNode;
};

function CustomLink({ href, children, ...props }: CustomLinkProps) {
    if (href.startsWith('/')) {
        return (
            <SmartLink href={href} {...props}>
                {children}
            </SmartLink>
        );
    }

    if (href.startsWith('#')) {
        return <a href={href} {...props}>{children}</a>;
    }

    return (
        <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
            {children}
        </a>
    );
}

function createImage({ alt, src, ...props }: SmartImageProps & { src: string }) {
    if (!src) {
        console.error("SmartImage requires a valid 'src' property.");
        return null;
    }

    return (
        <SmartImage
            className="my-20"
            enlarge
            radius="m"
            aspectRatio="16 / 9"
            alt={alt}
            src={src}
            {...props}/>
        )
}

function slugify(str: string): string {
    return str
        .toString()
        .toLowerCase()
        .trim() // Remove whitespace from both ends of a string
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/&/g, '-and-') // Replace & with 'and'
        .replace(/[^\w\-]+/g, '') // Remove all non-word characters except for -
        .replace(/\-\-+/g, '-') // Replace multiple - with single -
}

function createHeading(level: 1 | 2 | 3 | 4 | 5 | 6) {
    const CustomHeading = ({ children, ...props }: TextProps) => {
    const slug = slugify(children as string);
        return (
            <HeadingLink
                style={{marginTop: 'var(--static-space-24)', marginBottom: 'var(--static-space-12)'}}
                level={level}
                id={slug}
                {...props}>
                {children}
            </HeadingLink>
        );
    };
  
    CustomHeading.displayName = `Heading${level}`;
  
    return CustomHeading;
}

function createParagraph({ children }: TextProps) {
    return (
        <Text style={{lineHeight: '150%'}}
            variant="body-default-m"
            onBackground="neutral-medium"
            marginTop="8"
            marginBottom="12">
            {children}
        </Text>
    );
};

function createList({ children }: TextProps) {
    return (
        <Text
            as="ul"
            style={{
                listStyle: 'disc',
                paddingLeft: 'var(--static-space-24)',
                marginTop: 'var(--static-space-8)',
                marginBottom: 'var(--static-space-12)'
            }}
            variant="body-default-m"
            onBackground="neutral-medium">
            {children}
        </Text>
    );
}

function createListItem({ children }: TextProps) {
    return (
        <Text
            as="li"
            style={{
                display: 'list-item',
                marginBottom: 'var(--static-space-8)'
            }}
            variant="body-default-m"
            onBackground="neutral-medium">
            {children}
        </Text>
    );
}

// Handle standard markdown code blocks
function createCode({ children, className }: { children: string, className?: string }) {
    // Extract language from className (format is like "language-javascript")
    const language = className?.replace('language-', '') || 'plaintext';

    return (
        <CodeBlock
            className="my-8"
            compact
            codeInstances={[
                {
                    code: children,
                    label: '',
                    language: language
                },
            ]}
            copyButton={true}
        />
    );
}

const components = {
    p: createParagraph as any,
    h1: createHeading(1) as any,
    h2: createHeading(2) as any,
    h3: createHeading(3) as any,
    h4: createHeading(4) as any,
    h5: createHeading(5) as any,
    h6: createHeading(6) as any,
    img: createImage as any,
    a: CustomLink as any,
    ul: createList as any,
    li: createListItem as any,
    Table,
    CodeBlock,
    code: createCode as any,
    // Handle code blocks with language specification
    pre: ({ children }: { children: any }) => children,
    ArtisticScrollIllustration,
};

type CustomMDXProps = MDXRemoteProps & {
    components?: typeof components;
};

export function CustomMDX(props: CustomMDXProps) {
    
    return (
        // @ts-ignore: Suppressing type error for MDXRemote usage
        <MDXRemote
            {...props}
            components={{ ...components, ...(props.components || {}) }}
        />
    );
}
