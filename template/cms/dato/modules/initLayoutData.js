import fs from 'fs-extra';
import path from 'path';
import logger from 'consola';
import { runPromisesSequence } from '@stereorepo/sac';

import apolloClient from '../config/apollo';
import { locales } from '../config/i18n';

const initLayoutData = async function(moduleOptions) {
    const options = {
        layoutDataQuery: null,
        globalSeoQuery: null,
        ...this.options.layoutData,
        ...moduleOptions
    };

    let allLayoutsData = {};
    let globalSeoData = {};
    const handler = async ({ code, iso }) => {
        if (options.layoutDataQuery) {
            const layoutData = await apolloClient
                .query({ query: options.layoutDataQuery, variables: { lang: iso } })
                .then(result => result.data);
            allLayoutsData = { ...allLayoutsData, [code]: layoutData };
        } else {
            logger.info('You forgot to pass the layout data query to the initLayoutData module.');
            logger.info('See: ~/config/layout-data.js');
        }

        if (options.globalSeoQuery) {
            const seoData = await apolloClient
                .query({ query: options.globalSeoQuery, variables: { lang: iso } })
                .then(result => result.data);

            globalSeoData = { ...globalSeoData, [code]: seoData };
        } else {
            logger.info('You forgot to pass the global seo query to the initLayoutData module.');
            logger.info('See: ~/config/layout-data.js');
        }
    };

    // This function allows us to add a timeout between promises (not possible with Promise.all)
    await runPromisesSequence({ array: locales, handler });

    fs.ensureFileSync(path.join('cms', 'data', 'layout-data.json'));
    fs.ensureFileSync(path.join('cms', 'data', 'global-seo-data.json'));
    await fs
        .writeJSON(path.join('cms', 'data', 'layout-data.json'), allLayoutsData)
        .then(() => {
            logger.success('Layout data successfully extracted');
        })
        .catch(err => {
            logger.error('Error writing layoutData file', err);
        });
    await fs
        .writeJSON(path.join('cms', 'data', 'global-seo-data.json'), globalSeoData)
        .then(() => {
            logger.success('Global seo data successfully extracted');
        })
        .catch(err => {
            logger.error('Error writing globalSeoData file', err);
        });
};

export default initLayoutData;
