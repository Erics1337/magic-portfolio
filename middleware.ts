import createMiddleware from 'next-intl/middleware';
import { i18nOptions } from './src/app/resources/config';

export default createMiddleware({
  locales: i18nOptions.locales,
  defaultLocale: i18nOptions.defaultLocale,
  localePrefix: 'as-needed'
});

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
