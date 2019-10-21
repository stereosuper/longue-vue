<%_ if (apollo) { _%>
import homePageQuery from '~/cms/queries/homePageQuery';

<%_ if (i18n) { _%>
const getLocaleIso = ({ app, store }) => {
    const { locale } = store.state.i18n;
    const { locales } = app.i18n;
    const [{ iso }] = locales.filter(({ code }) => {
        return code === locale;
    });
    return iso;
};

export const getHome = async ({ app, store }) => {
<%_ } else { _%>
export const getHome = async ({ app }) => {
<%_ } _%>
    // Graphql homepage example
    const apolloClient = app.apolloProvider.defaultClient;

    <%_ if (i18n) { _%>
    // Getting the locale iso code for your cms
    const iso = getLocaleIso({ app, store });
    <%_ } _%>

    // Graphql query call example
    // SEE: ~/cms/queries/homePageQuery
    const home = await apolloClient
        .query({
            <%_ if (i18n) { _%>
            variables: { lang: iso },
            <%_ } _%>
            query: homePageQuery
        })
        .then(({ data: { allHomepages } }) => {
            const [{ node }] = allHomepages.edges;

            return node;
        })
        .catch(err => {
            console.error(err);
        });
    return { home };
};

export default { getHome };
<%_ } _%>
<%_ if (cms === 'wordpress') { _%>
import { acfApiEndpoint, apiBase, customApiEndpoint, wpApiEndpoint } from './cms.config';

/**
 * @description Dynamically getting your template query file
 * @author Alban Mezino <alban@stereosuper.fr>
 * @param {string} rawTemplate
 * @returns {Object}
 * @memberof WpApi
 */
export const templateQuery = async template => {
    // Replacing the file extension if not done yet
    //const template = rawTemplate.replace('.php', '');
    // Template data function dynamically imported
    const { default: getTemplateDataFunction } = await import(`./templates/${template}`);
    // Calling the function responsible for getting fetching the data
    return await getTemplateDataFunction();
};

const cleanUrls = json => {
    let stringified = JSON.stringify(json);
    const cmsUrl = process.env.CMS_URL;

    if (cmsUrl) {
        let urls = stringified.match(/(http(s?):)([\/|.|\w|\s|-])*/g);

        if (urls) {
            urls.filter(u => u.indexOf(`${cmsUrl}/wp-content`) === -1).forEach(url => {
                const newUrl = url.replace(cmsUrl, '');
                stringified = stringified.replace(url, newUrl);
            });
        }
    }

    return JSON.parse(stringified);
};

/**
 * @description Generates head override for pages components. It needs a WP api page object as argument.
 * @author Alban Mezino <alban@stereosuper.fr>
 * @param {Object} data
 * @returns
 * @memberof WpApi
 */
export const generateHead = data => {
    const seo = { title: '', meta: [] };
    if (data && data.yoast_meta) {
        const { yoast_wpseo_title: title, yoast_wpseo_metadesc: desc } = data.yoast_meta;

        seo.title = title;
        seo.meta.push({
            hid: 'description',
            name: 'description',
            content: desc
        });
    }
    return seo;
};
/**
 * @description Get json datas from WP API
 * @author Elisabeth Hamel <elisabeth@stereosuper.fr>
 * @param {string} url
 * @returns {Object}
 * @memberof WpApi
 */
const getDatas = async ({ axios, url }) => {
    return await axios
        .get(url)
        .then(json => cleanUrls(json.data))
        .catch(error => ({ error }));
};

export const getSettings = async ({ axios }) => {
    return await getDatas({ axios, url:apiBase });
};
export const getOptions = async ({ axios }) => {
    return await getDatas({ axios, url:`${acfApiEndpoint}/options/options` });
};
export const getMenu = async ({ axios }) => {
    return await getDatas({ axios, url:`${customApiEndpoint}/menu` });
};
export const getPage = async ({ axios, slug }) => {
    return await getDatas({ axios, url:`${wpApiEndpoint}/pages?slug=${slug}` });
};
export const getHome = async ({ axios }) => {
    return await getDatas({ axios, url:`${customApiEndpoint}/frontpage` });
};

export default {
    templateQuery,
    generateHead,
    getSettings,
    getOptions,
    getMenu,
    getPage,
    getHome
};
<%_ } _%>