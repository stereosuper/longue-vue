export const defaultLocale = 'fr';

export const locales = [{ code: 'fr', iso: 'fr_FR' }];

// 🚦 Specific routes
export const getPagesList = (isProdEnv = process.env.isProdEnv) => {
    return {
        'dynamic/index': {
            fr: '/dynamic'
        },
        'dynamic/_dynamic': {
            fr: '/dynamic/:dynamic?'
        }
    };
};

export default { locales, getPagesList };
