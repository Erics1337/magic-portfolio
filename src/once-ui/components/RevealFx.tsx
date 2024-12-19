'use client';

import React, { useState, useEffect, forwardRef } from 'react';
import { SpacingToken } from '../types';
import styles from './RevealFx.module.scss';
import { Flex } from '.';

interface RevealFxProps extends React.ComponentProps<typeof Flex> {
    children: React.ReactNode;
    speed?: 'slow' | 'medium' | 'fast';
    delay?: number;
    revealedByDefault?: boolean;
    translateY?: number | SpacingToken;
    trigger?: boolean;
    style?: React.CSSProperties;
    className?: string;
}

const RevealFx = forwardRef<HTMLDivElement, RevealFxProps>(({
    children,
    speed = 'medium',
    delay = 0,
    revealedByDefault = false,
    translateY,
    trigger,
    style,
    className,
    ...rest
}, ref) => {
    const [isRevealed, setIsRevealed] = useState(revealedByDefault);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const timer = setTimeout(() => {
            setIsRevealed(true);
        }, delay);

        return () => clearTimeout(timer);
    }, [delay, trigger]);

    const getSpeedDuration = () => {
        switch (speed) {
            case 'slow':
                return 1000;
            case 'fast':
                return 400;
            default:
                return 600;
        }
    };

    const getTranslateYValue = () => {
        if (typeof translateY === 'number') {
            return `${translateY}px`;
        }
        return translateY ? `var(--spacing-${translateY})` : '24px';
    };

    // Don't apply any animations during SSR
    if (!isMounted) {
        return (
            <Flex
                ref={ref}
                {...rest}
                style={style}
                className={className}>
                {children}
            </Flex>
        );
    }

    const translateValue = getTranslateYValue();
    const duration = getSpeedDuration();

    const combinedClassName = `${styles.revealFx} ${isRevealed ? styles.revealed : styles.hidden} ${className || ''}`;

    return (
        <Flex
            ref={ref}
            {...rest}
            style={{
                ...style,
                '--reveal-duration': `${duration}ms`,
                '--reveal-translate': translateValue,
            } as React.CSSProperties}
            className={combinedClassName}>
            {children}
        </Flex>
    );
});

RevealFx.displayName = 'RevealFx';

export { RevealFx };