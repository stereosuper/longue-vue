import { routes } from '../assets/js/constants/routes';

export const defaultLocale = 'fr';

/**
 * NOTE: Make sure that default locale is the last one!
 * SEE: https://nuxt-community.github.io/nuxt-i18n/routing.html#strategy
 */
export const locales = [{ code: 'fr', iso: 'fr_FR' }];

// 🚦 Specific routes
// NOTE: You can use isProdEnv to set conditionnal routes (not showing on prod for example)
export const getPagesList = (isProdEnv = process.env.isProdEnv) => ({
    [routes.dynamicListPage.i18nFormat]: {
        // Conditionnal route example
        fr: !isProdEnv ? '/dynamic' : false
    },
    [routes.dynamicSinglePage.i18nFormat]: {
        // Conditionnal route example
        fr: !isProdEnv ? '/dynamic/:dynamic?' : false
    }
});
