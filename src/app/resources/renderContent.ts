import { person, newsletter, social, home, about, blog, work, gallery } from './content';
import { createI18nContent } from './content-i18n';
import type { About } from './types';
import { i18n } from './config';

const renderContent = (t: any): { 
    person: any; 
    about: About; 
    social: any;
    newsletter: any;
    home: any;
    blog: any;
    work: any;
    gallery: any;
} => {
    if ( i18n ) {
        return createI18nContent(t);
    } else {
        return {
            person,
            social,
            newsletter,
            home,
            about,
            blog,
            work,
            gallery
        }
    }
};

export { renderContent };