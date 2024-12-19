'use client';

import React, { useEffect, useState } from 'react';
import { Flex, Text } from '@/once-ui/components';
import styles from './about.module.scss';

interface TableOfContentsProps {
    structure: {
        title: string;
        display: boolean;
        items: string[];
    }[];
    about: {
        tableOfContent: {
            display: boolean;
            subItems: boolean;
        };
    };
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ structure, about }) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const scrollTo = (id: string, offset: number) => {
        if (!isMounted) return;

        const element = document.getElementById(id);
        if (element) {
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth',
            });
        }
    };

    // During SSR or before mount, render a static version
    if (!isMounted) {
        return (
            <Flex
                direction="column"
                gap="16"
                className={styles.tableOfContents}>
                {structure.map((section, index) => (
                    section.display && (
                        <Flex
                            key={index}
                            direction="column"
                            gap="8">
                            <Text
                                weight="strong"
                                size="s">
                                {section.title}
                            </Text>
                            {about.tableOfContent.subItems && (
                                <Flex
                                    direction="column"
                                    gap="4">
                                    {section.items.map((item, itemIndex) => (
                                        <Text
                                            key={itemIndex}
                                            size="s"
                                            color="neutral-medium">
                                            {item}
                                        </Text>
                                    ))}
                                </Flex>
                            )}
                        </Flex>
                    )
                ))}
            </Flex>
        );
    }

    return (
        <Flex
            direction="column"
            gap="16"
            className={styles.tableOfContents}>
            {structure.map((section, index) => (
                section.display && (
                    <Flex
                        key={index}
                        direction="column"
                        gap="8">
                        <Text
                            weight="strong"
                            size="s"
                            onClick={() => scrollTo(`section-${index}`, 80)}
                            style={{ cursor: 'pointer' }}>
                            {section.title}
                        </Text>
                        {about.tableOfContent.subItems && (
                            <Flex
                                direction="column"
                                gap="4">
                                {section.items.map((item, itemIndex) => (
                                    <Text
                                        key={itemIndex}
                                        size="s"
                                        color="neutral-medium"
                                        onClick={() => scrollTo(`item-${index}-${itemIndex}`, 80)}
                                        style={{ cursor: 'pointer' }}>
                                        {item}
                                    </Text>
                                ))}
                            </Flex>
                        )}
                    </Flex>
                )
            ))}
        </Flex>
    );
};

export default TableOfContents;