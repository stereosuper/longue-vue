import { getPagesList } from '~/config/i18n';

const checkSlashes = string => string.replace(/^\//, '');

export const getDynamicRoute = ({ route, slug, store }) => {
    const currentLocale = store.state.i18n.locale;
    const { localePath } = store.state;
    const pages = getPagesList();
    const nestedName = pages[route][currentLocale];
    const [, path] = nestedName
        .split('/')
        .reverse()
        .filter(Boolean);

    return `${localePath}${path}/${slug}`;
};

export const getSpecificRoute = ({ route, store }) => checkSlashes(getPagesList()[route][store.state.i18n.locale]);
