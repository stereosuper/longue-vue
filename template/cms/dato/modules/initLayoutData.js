import fs from 'fs-extra';
import path from 'path';
import logger from 'consola';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import fetch from 'node-fetch';
import { runPromisesSequence } from '@stereorepo/sac';

import introspectionQueryResultData from '../cms/data/fragment-types.json';
import layoutQuery from '../cms/queries/layoutQuery';
import globalSeoQuery from '../cms/queries/globalSeoQuery';

import { locales } from '../config/i18n';

const initLayoutData = async function() {
    const token = process.env.DATO_TOKEN;

    const link = createHttpLink({
        fetch,
        uri: 'https://graphql.datocms.com/',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
        }
    });

    const fragmentMatcher = new IntrospectionFragmentMatcher({
        introspectionQueryResultData
    });

    const client = new ApolloClient({
        link,
        cache: new InMemoryCache({ fragmentMatcher })
    });

    let allLayoutsData = {};
    let globalSeoData = {};
    const handler = async ({ code, iso }) => {
        const layoutData = await client
            .query({ query: layoutQuery, variables: { lang: iso } })
            .then(result => result.data);
        const seoData = await client
            .query({ query: globalSeoQuery, variables: { lang: iso } })
            .then(result => result.data);

        allLayoutsData = { ...allLayoutsData, [code]: layoutData };
        globalSeoData = { ...globalSeoData, [code]: seoData };
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
