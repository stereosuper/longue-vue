import { routes } from '../assets/js/constants/routes';

export const defaultLocale = 'fr';

export const locales = [{ code: 'fr', iso: 'fr_FR' }];

// 🚦 Specific routes
// NOTE: You can use isProdEnv to set conditionnal routes (not showing on prod for example)
export const getPagesList = (isProdEnv = process.env.isProdEnv) => ({
    [routes.dynamicListPage.i18nFormat]: {
        // Conditionnal route example
        fr: isProdEnv ? '/dynamic' : false
    },
    [routes.dynamicSinglePage.i18nFormat]: {
        // Conditionnal route example
        fr: isProdEnv ? '/dynamic/:dynamic?' : false
    }
});
