export const defaultLocale = 'fr';

export const locales = [{ code: 'fr', iso: 'fr_FR' }];

// 🚦 Specific routes
// NOTE: You can use isProdEnv to set conditionnal routes (not showing on prod for example)
export const getPagesList = (isProdEnv = process.env.isProdEnv) => ({
    'dynamic/index': {
        // Conditionnal route example
        fr: isProdEnv ? '/dynamic' : false
    },
    'dynamic/_dynamic': {
        // Conditionnal route example
        fr: isProdEnv ? '/dynamic/:dynamic?' : false
    }
});
