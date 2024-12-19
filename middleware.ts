import createMiddleware from 'next-intl/middleware';
import { i18nOptions } from './src/app/resources/config';

export default createMiddleware({
  locales: i18nOptions.locales,
  defaultLocale: i18nOptions.defaultLocale,
  localePrefix: 'always'  // Change to 'always' for static exports
});

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
