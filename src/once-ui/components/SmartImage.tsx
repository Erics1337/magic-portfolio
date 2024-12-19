'use client';

import React, { CSSProperties, useState, useRef, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';
import classNames from 'classnames';

import { Flex, Skeleton } from '@/once-ui/components';

export type SmartImageProps = ImageProps & {
    className?: string;
    style?: React.CSSProperties;
    aspectRatio?: string;
    height?: number;
    radius?: string;
    alt?: string;
    isLoading?: boolean;
    objectFit?: CSSProperties['objectFit'];
    enlarge?: boolean;
    src: string;
    unoptimized?: boolean;
};

const SmartImage: React.FC<SmartImageProps> = ({
    className,
    style,
    aspectRatio,
    height,
    radius,
    alt = '',
    isLoading = false,
    objectFit = 'cover',
    enlarge = false,
    src,
    unoptimized = false,
    ...props
}) => {
    const [isEnlarged, setIsEnlarged] = useState(false);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const imageRef = useRef<HTMLDivElement>(null);

    const handleClick = () => {
        if (enlarge) {
            setIsEnlarged(!isEnlarged);
        }
    };

    useEffect(() => {
        // Only run in browser environment
        if (typeof window === 'undefined') return;

        const updateDimensions = () => {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        // Initial dimensions
        updateDimensions();

        // Update dimensions on resize
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    useEffect(() => {
        // Only run in browser environment
        if (typeof document === 'undefined') return;

        if (isEnlarged) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isEnlarged]);

    const calculateTransform = () => {
        // Only calculate transform in browser environment
        if (typeof window === 'undefined' || !imageRef.current) return {};

        const rect = imageRef.current.getBoundingClientRect();
        const scaleX = dimensions.width / rect.width;
        const scaleY = dimensions.height / rect.height;
        const scale = Math.min(scaleX, scaleY) * 0.9;

        const translateX = (dimensions.width - rect.width) / 2 - rect.left;
        const translateY = (dimensions.height - rect.height) / 2 - rect.top;

        return {
            transform: isEnlarged
                ? `translate(${translateX}px, ${translateY}px) scale(${scale})`
                : 'translate(0, 0) scale(1)',
            transition: 'all 0.3s ease-in-out',
            zIndex: isEnlarged ? 2 : 1,
        };
    };

    const isYouTubeVideo = (url: string) => {
        const youtubeRegex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        return youtubeRegex.test(url);
    };

    const getYouTubeEmbedUrl = (url: string) => {
        const match = url.match(/(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
        return match 
            ? `https://www.youtube.com/embed/${match[1]}?controls=0&rel=0&modestbranding=1` 
            : '';
    };

    const isVideo = src?.endsWith('.mp4');
    const isYouTube = isYouTubeVideo(src);

    return (
        <div
            ref={imageRef}
            className={classNames(
                'relative overflow-hidden',
                { 'cursor-pointer': enlarge },
                className
            )}
            style={{
                ...style,
                aspectRatio,
                borderRadius: radius,
            }}
            onClick={handleClick}
        >
            {isLoading ? (
                <Skeleton shape="block" className="w-full h-full" />
            ) : (
                <>
                    {isVideo ? (
                        <video
                            src={src}
                            autoPlay
                            loop
                            muted
                            playsInline
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: isEnlarged ? 'contain' : objectFit,
                            }}
                        />
                    ) : isYouTube ? (
                        <iframe
                            width="100%"
                            height="100%"
                            src={getYouTubeEmbedUrl(src)}
                            frameBorder="0"
                            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            style={{
                                objectFit: objectFit,
                            }}
                        />
                    ) : (
                        <img
                            src={src}
                            alt={alt}
                            className={classNames(
                                'w-full h-full',
                                { 'object-cover': objectFit === 'cover' },
                                { 'object-contain': objectFit === 'contain' }
                            )}
                            loading="lazy"
                            {...props}
                        />
                    )}
                    {isEnlarged && (
                        <div
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsEnlarged(false);
                            }}
                        >
                            {isVideo ? (
                                <video
                                    src={src}
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    className="max-w-[90vw] max-h-[90vh] object-contain"
                                />
                            ) : isYouTube ? (
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={getYouTubeEmbedUrl(src)}
                                    frameBorder="0"
                                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="max-w-[90vw] max-h-[90vh] object-contain"
                                />
                            ) : (
                                <img
                                    src={src}
                                    alt={alt}
                                    className="max-w-[90vw] max-h-[90vh] object-contain"
                                />
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

SmartImage.displayName = 'SmartImage';

export { SmartImage };