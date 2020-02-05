import allSlugsQuery from '~/cms/queries/allSlugsQuery';

import errorPageQuery from '~/cms/queries/errorPageQuery';
import homePageQuery from '~/cms/queries/homePageQuery';
import basicPageQuery from '~/cms/queries/basicPageQuery';

import dynamicSinglePageQuery from '~/cms/queries/dynamicSinglePageQuery';
import dynamicListPageQuery from '~/cms/queries/dynamicListPageQuery';

import apolloClient from '~/config/apollo';

/**
 * I18n
 */
export const getLocaleIso = ({ app, store }) => {
    const { locale } = store.state.i18n;
    const { locales } = app.i18n ? app.i18n : app.$i18n;
    const [{ iso }] = locales.filter(({ code }) => {
        return code === locale;
    });
    return iso;
};

const handleLocalePath = ({ app, store }) => {
    const { locale } = store.state.i18n;
    const { defaultLocale } = app.i18n ? app.i18n : app.$i18n;
    store.commit('setLocalePath', { locale, defaultLocale });
};

/**
 * Slugs
 */
const getSlug = ({ app, routePath }) =>
    app.i18n.locales
        .reduce((acc, { code }) => {
            const [firstUrlPart] = acc;
            if (code === firstUrlPart) acc.shift();
            return acc;
        }, routePath.split('/').filter(Boolean))
        .pop();

// SEE: https://nuxt-community.github.io/nuxt-i18n/lang-switcher.html#dynamic-route-parameters
const storeSlugs = async ({ app, pageContent: { _allSlugLocales }, store }) => {
    const { locales } = app.i18n ? app.i18n : app.$i18n;
    const codeByIso = locales.reduce((acc, { code, iso }) => ({ ...acc, [iso]: code }), {});

    const i18nRouteParams = _allSlugLocales.reduce((acc, { locale: iso, value: slug }) => {
        if (!codeByIso[iso]) return acc;
        return { ...acc, [codeByIso[iso]]: { slug } };
    }, {});

    await store.dispatch('i18n/setRouteParams', i18nRouteParams);
};

/**
 * Query related
 */
const makeQuery = async ({ app, query, slug = null, store }) => {
    // Getting the locale iso code for your cms
    const iso = getLocaleIso({ app, store });
    // Setting the locale path used for internal links
    handleLocalePath({ app, store });

    const variables = { lang: iso };

    if (slug) {
        variables.slug = slug;
    }

    const data = await apolloClient
        .query({
            variables,
            query
        })
        .then(({ data }) => data)
        .catch(err => {
            console.error(err);
        });

    return data;
};

/**
 * Dynamic pages validation
 */
export const validateDynamicPage = async ({ app, routePath, routeName, store }) => {
    // Getting the current slug
    const slug = getSlug({
        app,
        routePath
    });

    // Getting the locale iso code for the query
    const iso = getLocaleIso({
        app,
        store
    });
    const variables = { lang: iso };

    // Setting the default query
    let query = allSlugsQuery('allBasicPages');

    // Removing the locale from the current route name
    const currentRouteName = routeName
        .split('-')
        .slice(0, -1)
        .join('-');

    // Switching query if we're on a specific dynamic page's route
    switch (currentRouteName) {
        case 'dynamic-dynamic':
            query = allSlugsQuery('allDynamicPages');
            break;
    }

    const data = await apolloClient
        .query({ variables, query })
        .then(({ data }) => data)
        .catch(err => {
            console.error(err);
        });

    const [dataArray] = Object.values(data);

    const allSlugs = dataArray
        .reduce((acc, { _allSlugLocales }) => [...acc, ..._allSlugLocales], [])
        .map(({ value }) => value);

    return allSlugs.includes(slug);
};

/**
 * Pages getters exports
 */

// Home page
export const getHome = async ({ app, store }) => {
    // ~/pages/index graphql query call
    // SEE: ~/cms/queries/homePageQuery
    const cmsData = await makeQuery({ app, query: homePageQuery, store });

    return Object.freeze(cmsData);
};

// Basic page
export const getBasicPage = async ({ app, slug, store }) => {
    // ~/pages/_slug graphql query call
    // SEE: ~/cms/queries/basicPageQuery
    const { basicPage } = await makeQuery({
        app,
        query: basicPageQuery,
        slug,
        store
    });

    if (basicPage) {
        // NOTE: ⚠️ Do not forget to call storeSlugs to translate pages slugs
        await storeSlugs({ app, pageContent: basicPage, store });
    }

    return Object.freeze(basicPage);
};

// Dynamic
export const getDynamicSingle = async ({ app, routePath, store }) => {
    const slug = getSlug({ app, routePath });

    // ~/pages/dynamic/_dynamic graphql query call
    // SEE: ~/cms/queries/dynamicSinglePageQuery
    const { dynamicPage } = await makeQuery({
        app,
        query: dynamicSinglePageQuery,
        slug,
        store
    });

    if (dynamicPage) {
        // NOTE: ⚠️ Do not forget to call storeSlugs to translate pages slugs
        await storeSlugs({ app, pageContent: dynamicPage, store });
    }

    return Object.freeze(dynamicPage);
};

export const getDynamicList = async ({ app, store }) => {
    // ~/pages/dynamic/index graphql query call
    // SEE: ~/cms/queries/dynamicListPageQuery
    const { dynamicListPage } = await makeQuery({
        app,
        query: dynamicListPageQuery,
        store
    });

    return Object.freeze(dynamicListPage);
};

// Error
export const getErrorPage = async ({ app, store }) => {
    // ~/layout/error page graphql query call
    // SEE: ~/cms/queries/errorPageQuery
    const { errorPage } = await makeQuery({ app, query: errorPageQuery, store });

    return Object.freeze(errorPage);
};
