import { join } from 'path';
import { readdirSync } from 'fs-extra';
import { runPromisesSequence } from '@stereorepo/sac';
import logger from 'consola';

import apolloClient from '../../config/apollo';
import { defaultLocale, getPagesList, locales } from '../../config/i18n';
import { routeByApiModels } from '../../assets/js/constants/routes';

const routeResolver = ({ dynamicRootPageName, localeCode, routeData }) => {
    // The page's _modelApiKey and slug will determine the way to resolve the page
    const { _modelApiKey, slug } = routeData;

    // Getting the i18n config from the _modelApiKey
    const i18nPageConfig = getPagesList()[routeByApiModels[_modelApiKey].i18nFormat];

    // Handling the locale in the final url
    const localePath = localeCode === defaultLocale ? '' : `/${localeCode}`;

    // If an i18n config is found and the page is not matching with the dynamic root page template
    if (i18nPageConfig && dynamicRootPageName !== routeByApiModels[_modelApiKey].i18nFormat) {
        const i18nPath = i18nPageConfig[localeCode];
        const slugPathIndex = i18nPath.indexOf(':');

        // With a slug
        if (slug && slugPathIndex !== -1) {
            const pathStaticPart = i18nPath.slice(0, slugPathIndex);
            return `${localePath}${pathStaticPart}${slug}`;
        }
        // Without a slug
        else {
            return `${localePath}${i18nPath}`;
        }
    }
    // If there is a slug and no i18n config (a.k.a. dynamic root page)
    else if (slug) {
        return `${localePath}/${slug}`;
    }

    // Return nothing if there's no match at all
    return null;
};

export default async ({ generator, routes, options }) => {
    // eslint-disable-next-line
    if (!options.query) logger.error(new Error('Crawler module: No query found in crawler module\'s options.'));

    const pagesDirPath = join(__dirname, '../../pages');
    // The pre-existing routes list (before extending routes)
    const existingRoutes = routes.map(({ route }) => route);

    // Getting the ~/pages directory's root dynamic page name
    const [dynamicRootPageFilename] = readdirSync(pagesDirPath).filter(file => file.indexOf('_') === 0);
    const dynamicRootPageName = dynamicRootPageFilename ? dynamicRootPageFilename.replace('.vue', '') : null;

    const localesHandler = async ({ code, iso }) => {
        // Getting the crawler's config gql query results
        const pageTypes = await apolloClient
            .query({
                query: options.query,
                variables: { lang: iso }
            })
            .then(result => result.data);

        // Getting all pages api models at the same level in the same array
        const pagesResults = Object.values(pageTypes).reduce((acc, type) => {
            if (Array.isArray(type)) {
                acc = [...acc, ...type];
            } else {
                acc = [...acc, type];
            }
            return acc;
        }, []);

        // Resolving pages collected with the gql query
        const routesHandler = routeData => {
            const resolvedRoute = routeResolver({ dynamicRootPageName, localeCode: code, routeData });

            /**
             * NOTE:
             * - Do not generate the route if it is not resolved.
             * - Do not generate the route if it is already registered in the routes list.
             */
            if (!resolvedRoute || existingRoutes.includes(resolvedRoute)) return new Promise(resolve => resolve());

            // Add the route to generation list
            return generator.generateRoute({
                route: resolvedRoute,
                payload: null
            });
        };

        await runPromisesSequence({ array: pagesResults, handler: routesHandler, delay: 0 });
    };

    // Starting to resolve routes depending on all the locales
    logger.info('Generating extended pages');
    await runPromisesSequence({ array: locales, handler: localesHandler, delay: 0 });
};
