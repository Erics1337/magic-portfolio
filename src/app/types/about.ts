import { ReactNode } from 'react';
import { ImageType } from './image';

export interface Institution {
    name: string;
    description: ReactNode;
    logo?: string;
}

export interface Certification {
    name: string;
    credentialURL: string;
    image: string;
    issuer: string;
    issueDate: string;
    expirationDate: string;
    description: string;
    credentialId: string;
}

export interface WorkExperience {
    company: string;
    role: string;
    timeframe: string;
    achievements: string[];
    images: ImageType[];
}

export interface TechnicalSkill {
    name: string;
    description: string;
    icon?: string;
    images: ImageType[];
}

export interface About {
    label: string;
    title: string;
    description: string;
    tableOfContent: {
        display: boolean;
        subItems: boolean;
    };
    avatar: {
        display: boolean;
    };
    calendar: {
        display: boolean;
        link: string;
    };
    intro: {
        display: boolean;
        title: string;
        description: string;
    };
    studies: {
        title: string;
        display: boolean;
        institutions: Institution[];
    };
    work: {
        title: string;
        display: boolean;
        experiences: WorkExperience[];
    };
    certifications: {
        title: string;
        display: boolean;
        items: Certification[];
    };
    technical: {
        title: string;
        display: boolean;
        skills: TechnicalSkill[];
    };
}
