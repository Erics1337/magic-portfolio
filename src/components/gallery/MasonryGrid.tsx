"use client";

import Masonry from 'react-masonry-css';
import { SmartImage } from "@/once-ui/components";
import styles from "./Gallery.module.scss";
import Link from 'next/link';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { renderContent } from '@/app/resources';

export interface GalleryImage {
    src: string;
    alt: string;
    link: string;
    type: 'blog' | 'project';
    orientation: 'horizontal' | 'vertical';
    fallbackSrc: string;
}

interface MasonryGridProps {
    images: GalleryImage[];
}

export default function MasonryGrid({ images }: MasonryGridProps) {
    const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
    const [imageDimensions, setImageDimensions] = useState<Record<string, { width: number; height: number }>>({});

    const breakpointColumnsObj = {
        default: 4,
        1440: 3,
        1024: 2,
        560: 1
    };

    const t = useTranslations();

    const handleImageError = (imageSrc: string) => {
        setImageErrors(prev => ({ ...prev, [imageSrc]: true }));
    };

    const handleImageLoad = (imageSrc: string, event: React.SyntheticEvent<HTMLImageElement>) => {
        const img = event.target as HTMLImageElement;
        setImageDimensions(prev => ({
            ...prev,
            [imageSrc]: { width: img.naturalWidth, height: img.naturalHeight }
        }));
    };

    return (
        <Masonry
            breakpointCols={breakpointColumnsObj}
            className={styles.masonryGrid}
            columnClassName={styles.masonryGridColumn}>
            {images.map((image, index) => {
                const dimensions = imageDimensions[image.src];
                const aspectRatio = dimensions 
                    ? `${dimensions.width} / ${dimensions.height}`
                    : image.orientation === "horizontal" ? "16 / 9" : "9 / 16";

                return (
                    <Link key={index} href={image.link} className={`${styles.imageLink} cursor-pointer`}>
                        <div className={styles.imageContainer} style={{ aspectRatio }}>
                            <SmartImage
                                radius="m"
                                src={imageErrors[image.src] ? image.fallbackSrc : image.src}
                                alt={image.alt}
                                className={styles.gridItem}
                                onError={() => handleImageError(image.src)}
                                onLoad={(e) => handleImageLoad(image.src, e)}
                                fill
                                sizes="(max-width: 560px) 100vw, (max-width: 1024px) 50vw, (max-width: 1440px) 33vw, 25vw"
                                style={{
                                    objectFit: 'cover'
                                }}
                            />
                        </div>
                        <div className={styles.imageOverlay}>
                            <span className={styles.imageTitle}>{image.alt}</span>
                            <span className={styles.imageType}>{image.type}</span>
                        </div>
                    </Link>
                );
            })}
        </Masonry>
    );
}