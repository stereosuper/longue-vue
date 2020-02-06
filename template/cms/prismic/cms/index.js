import homePageQuery from '~/cms/queries/homePageQuery';

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

    // NOTE: ⚠️ Prismic needs iso tag parsing (from 'fr_FR' to 'fr-fr')
    return iso.toLowerCase().replace('_', '-');
};

const handleLocalePath = ({ app, store }) => {
    const { locale } = store.state.i18n;
    const { defaultLocale } = app.i18n ? app.i18n : app.$i18n;
    store.commit('setLocalePath', { locale, defaultLocale });
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
 * Pages getters exports
 */

// Home page
export const getHome = async ({ app, store }) => {
    // ~/pages/index graphql query call
    // SEE: ~/cms/queries/homePageQuery
    const cmsData = await makeQuery({ app, query: homePageQuery, store });

    return Object.freeze(cmsData);
};
