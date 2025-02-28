"use client";

import { AvatarGroup, Flex, Heading, RevealFx, SmartImage, SmartLink, Text } from "@/once-ui/components";
import { useEffect, useState, useRef } from "react";
import { useTranslations } from 'next-intl';

interface ProjectCardProps {
    href: string;
    images: string[];
    title: string;
    content: string;
    description: string;
    avatars: { src: string }[];
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
    href,
    images = [],
    title,
    content,
    description,
    avatars
}) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [nextImageIndex, setNextImageIndex] = useState(1);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [preloadedImages] = useState<Set<string>>(new Set());
    const t = useTranslations();
    const nextImageRef = useRef<HTMLImageElement>(null);
    const preloadedImagesRef = useRef<Set<string>>(new Set());

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsTransitioning(true);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        setNextImageIndex((activeIndex + 1) % images.length);
    }, [activeIndex, images.length]);

    useEffect(() => {
        const preloadImage = (src: string) => {
            if (!preloadedImagesRef.current.has(src)) {
                const img = new Image();
                img.onload = () => {
                    preloadedImagesRef.current.add(src);
                };
                img.src = src;
            }
        };

        // Preload all images immediately
        images.forEach(preloadImage);
    }, [images]); // Only re-run if images array changes

    useEffect(() => {
        // Ensure next image is preloaded when activeIndex changes
        if (images[nextImageIndex]) {
            const img = new Image();
            img.onload = () => {
                preloadedImagesRef.current.add(images[nextImageIndex]);
            };
            img.src = images[nextImageIndex];
        }
    }, [nextImageIndex, images]);

    const handleImageClick = () => {
        if(images.length > 1) {
            setIsTransitioning(false);
            const nextIndex = (activeIndex + 1) % images.length;
            handleControlClick(nextIndex);

        }
    };

    const handleControlClick = (index: number) => {
        if (index !== activeIndex) {
            setIsTransitioning(false);
            setTimeout(() => {
                setActiveIndex(index);
                setIsTransitioning(true);
            }, 630);
        }
    };

    return (
        <Flex
            fillWidth gap="m"
            direction="column">
            {images[activeIndex] && <Flex onClick={handleImageClick}>
                <RevealFx
                    style={{width: '100%'}}
                    delay={0.4}
                    trigger={isTransitioning}
                    speed="fast">
                    <SmartImage
                        tabIndex={0}
                        radius="l"
                        alt={title}
                        aspectRatio="16 / 9"
                        src={images[activeIndex]}
                        style={{
                            border: '1px solid var(--neutral-alpha-weak)',
                            ...(images.length > 1 && {
                                cursor: 'pointer',
                            }),
                        }}/>
                </RevealFx>
            </Flex>}
            {images.length > 1 && (
                <Flex
                    gap="4" paddingX="s"
                    fillWidth
                    justifyContent="center">
                    {images.map((_, index) => (
                        <Flex
                            key={index}
                            onClick={() => handleControlClick(index)}
                            style={{
                                background: activeIndex === index 
                                    ? 'var(--neutral-on-background-strong)' 
                                    : 'var(--neutral-alpha-medium)',
                                cursor: 'pointer',
                                transition: 'background 0.3s ease',
                            }}
                            fillWidth
                            height="2">
                        </Flex>
                    ))}
                </Flex>
            )}
            <Flex
                mobileDirection="column"
                fillWidth paddingX="s" paddingTop="12" paddingBottom="24" gap="l">
                {title && (
                    <Flex
                        flex={5}>
                        <SmartLink href={href}
                         className="hover:underline hover:underline-offset-4"
                        >
                            <Heading
                                as="h2"
                                wrap="balance"
                                variant="heading-strong-xl">
                                {title}
                            </Heading>
                        </SmartLink>
                    </Flex>
                )}
                {(avatars?.length > 0 || description?.trim() || content?.trim()) && (
                    <Flex
                        flex={7} direction="column"
                        gap="16">
                        {avatars?.length > 0 && (
                            <AvatarGroup
                                avatars={avatars}
                                size="m"
                                reverseOrder/>
                        )}
                        {description?.trim() && (
                            <Text
                                wrap="balance"
                                variant="body-default-s"
                                onBackground="neutral-weak">
                                {description}
                            </Text>
                        )}
                        {content?.trim() && (
                            <SmartLink
                                suffixIcon="chevronRight"
                                style={{margin: '0', width: 'fit-content'}}
                                href={href}>
                                    <Text
                                        variant="body-default-s">
                                       {t("projectCard.label")}
                                    </Text>
                            </SmartLink>
                        )}
                    </Flex>
                )}
            </Flex>
        </Flex>
    );
};
