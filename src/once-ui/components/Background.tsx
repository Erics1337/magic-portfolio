'use client';

import React, { CSSProperties, forwardRef, useEffect, useRef, useState } from 'react';
import { SpacingToken } from '../types';

function setRef<T>(ref: React.Ref<T> | undefined, value: T | null) {
    if (typeof ref === 'function') {
        ref(value);
    } else if (ref && 'current' in ref) {
        (ref as React.MutableRefObject<T | null>).current = value;
    }
}

export interface MaskOptions {
    none: 'none';
    cursor: 'cursor';
    topLeft: 'topLeft';
    topRight: 'topRight';
    bottomLeft: 'bottomLeft';
    bottomRight: 'bottomRight';
}

type MaskType = keyof MaskOptions;

export interface BackgroundProps {
    position?: CSSProperties['position'];
    gradient?: GradientProps;
    dots?: DotsProps;
    lines?: LinesProps;
    mask?: MaskType;
    className?: string;
    style?: CSSProperties;
}

export interface GradientProps {
    display?: boolean;
    opacity?: number;
}

export interface DotsProps {
    display?: boolean;
    opacity?: number;
    color?: string;
    size?: SpacingToken;
}

export interface LinesProps {
    display?: boolean;
    opacity?: number;
    size?: SpacingToken;
}

const Background = forwardRef<HTMLDivElement, BackgroundProps>(
    ({
        position = 'fixed',
        gradient = {},
        dots = {},
        lines = {},
        mask = 'none',
        className,
        style,
        ...props
    }, ref) => {
        const [isMounted, setIsMounted] = useState(false);
        const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
        const [smoothPosition, setSmoothPosition] = useState({ x: 0, y: 0 });
        const animationFrameRef = useRef<number>();
        const backgroundRef = useRef<HTMLDivElement>(null);
        const combinedRef = useRef<HTMLDivElement>(null);

        useEffect(() => {
            setIsMounted(true);
            return () => {
                if (animationFrameRef.current) {
                    cancelAnimationFrame(animationFrameRef.current);
                }
            };
        }, []);

        useEffect(() => {
            if (!isMounted) return;

            const handleMouseMove = (event: MouseEvent) => {
                if (mask === 'cursor') {
                    setMousePosition({
                        x: event.clientX,
                        y: event.clientY,
                    });
                }
            };

            if (mask === 'cursor') {
                window.addEventListener('mousemove', handleMouseMove);
            }

            return () => {
                if (mask === 'cursor') {
                    window.removeEventListener('mousemove', handleMouseMove);
                }
            };
        }, [mask, isMounted]);

        useEffect(() => {
            if (!isMounted || mask !== 'cursor') return;

            const updateSmoothPosition = () => {
                setSmoothPosition(prev => ({
                    x: prev.x + (mousePosition.x - prev.x) * 0.1,
                    y: prev.y + (mousePosition.y - prev.y) * 0.1,
                }));
                animationFrameRef.current = requestAnimationFrame(updateSmoothPosition);
            };

            animationFrameRef.current = requestAnimationFrame(updateSmoothPosition);

            return () => {
                if (animationFrameRef.current) {
                    cancelAnimationFrame(animationFrameRef.current);
                }
            };
        }, [mousePosition, mask, isMounted]);

        const maskStyle = (): CSSProperties => {
            switch (mask) {
                case 'cursor':
                    return {
                        maskImage: 'radial-gradient(circle at center, transparent, black 70%)',
                        WebkitMaskImage: 'radial-gradient(circle at center, transparent, black 70%)',
                        maskPosition: `${smoothPosition.x}px ${smoothPosition.y}px`,
                        WebkitMaskPosition: `${smoothPosition.x}px ${smoothPosition.y}px`,
                        maskSize: '200% 200%',
                        WebkitMaskSize: '200% 200%',
                    };
                case 'topLeft':
                    return {
                        maskImage: 'linear-gradient(45deg, transparent, black)',
                        WebkitMaskImage: 'linear-gradient(45deg, transparent, black)',
                    };
                case 'topRight':
                    return {
                        maskImage: 'linear-gradient(-45deg, transparent, black)',
                        WebkitMaskImage: 'linear-gradient(-45deg, transparent, black)',
                    };
                case 'bottomLeft':
                    return {
                        maskImage: 'linear-gradient(135deg, transparent, black)',
                        WebkitMaskImage: 'linear-gradient(135deg, transparent, black)',
                    };
                case 'bottomRight':
                    return {
                        maskImage: 'linear-gradient(-135deg, transparent, black)',
                        WebkitMaskImage: 'linear-gradient(-135deg, transparent, black)',
                    };
                default:
                    return {};
            }
        };

        // During SSR, render a simpler version without animations
        if (!isMounted) {
            return (
                <div
                    ref={(node) => {
                        setRef(ref, node);
                        setRef(combinedRef, node);
                    }}
                    style={{
                        position,
                        width: '100%',
                        height: '100%',
                        ...style,
                    }}
                    className={className}
                    {...props}
                />
            );
        }

        return (
            <>
                {gradient.display && (
                    <div
                        ref={backgroundRef}
                        style={{
                            position,
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            background: 'radial-gradient(circle at center, var(--gradient-start), var(--gradient-end))',
                            opacity: gradient.opacity ?? 0.5,
                            pointerEvents: 'none',
                            ...maskStyle(),
                            ...style,
                        }}
                        className={className}
                        {...props}
                    />
                )}
                {dots.display && (
                    <div
                        style={{
                            position,
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundImage: 'radial-gradient(var(--color-neutral-dark) 1px, transparent 0)',
                            backgroundSize: `${dots.size ?? 24}px ${dots.size ?? 24}px`,
                            opacity: dots.opacity ?? 0.5,
                            pointerEvents: 'none',
                            ...maskStyle(),
                            ...style,
                        }}
                        className={className}
                        {...props}
                    />
                )}
                {lines.display && (
                    <div
                        style={{
                            position,
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundImage: `
                                linear-gradient(var(--color-neutral-dark) 1px, transparent 1px),
                                linear-gradient(90deg, var(--color-neutral-dark) 1px, transparent 1px)
                            `,
                            backgroundSize: `${lines.size ?? 24}px ${lines.size ?? 24}px`,
                            opacity: lines.opacity ?? 0.5,
                            pointerEvents: 'none',
                            ...maskStyle(),
                            ...style,
                        }}
                        className={className}
                        {...props}
                    />
                )}
            </>
        );
    }
);

Background.displayName = 'Background';

export { Background };