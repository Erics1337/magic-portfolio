export const i18nOptions = {
    locales: ['en', 'id'],
    defaultLocale: 'en'
} as const;

export const routes = {
    home: '/',
    about: '/about',
    blog: '/blog',
    work: '/work',
    gallery: '/gallery'
};

export const protectedRoutes = [];

export const effects = {
    fadeIn: 'fade-in',
    slideIn: 'slide-in'
};

export const style = {
    primary: 'primary',
    secondary: 'secondary'
};

export const display = {
    grid: 'grid',
    list: 'list',
    time: 'time'
};

export const mailchimp = {
    MAILCHIMP_API_KEY: process.env.MAILCHIMP_API_KEY || '',
    MAILCHIMP_API_SERVER: process.env.MAILCHIMP_API_SERVER || '',
    MAILCHIMP_AUDIENCE_ID: process.env.MAILCHIMP_AUDIENCE_ID || '',
    effects: {
        mask: 'mask',
        gradient: 'gradient',
        dots: 'dots',
        lines: 'lines'
    },
    get action() {
        return `https://${this.MAILCHIMP_API_SERVER}.list-manage.com/subscribe/post?u=${this.MAILCHIMP_API_KEY}&id=${this.MAILCHIMP_AUDIENCE_ID}`;
    }
};

export const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
