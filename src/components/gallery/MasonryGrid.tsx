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

    return (
        <Masonry
            breakpointCols={breakpointColumnsObj}
            className={styles.masonryGrid}
            columnClassName={styles.masonryGridColumn}>
            {images.map((image, index) => (
                <Link key={index} href={image.link} className={styles.imageLink}>
                    <SmartImage
                        radius="m"
                        aspectRatio={image.orientation === "horizontal" ? "16 / 9" : "9 / 16"}
                        src={imageErrors[image.src] ? image.fallbackSrc : image.src}
                        alt={image.alt}
                        className={styles.gridItem}
                        onError={() => handleImageError(image.src)}
                    />
                    <div className={styles.imageOverlay}>
                        <span className={styles.imageTitle}>{image.alt}</span>
                        <span className={styles.imageType}>{image.type}</span>
                    </div>
                </Link>
            ))}
        </Masonry>
    );
}