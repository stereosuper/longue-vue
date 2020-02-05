import fs from 'fs-extra';
import path from 'path';
import logger from 'consola';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import { PrismicLink } from 'apollo-link-prismic';
import { runPromisesSequence } from '@stereorepo/sac';

import { graphqlEndpoint } from '../config/cms';

import introspectionQueryResultData from '../cms/data/fragment-types.json';
import layoutQuery from '../cms/queries/layoutQuery';

import { locales } from '../config/i18n';

const initLayoutData = async function() {
    const token = process.env.PRISMIC_TOKEN;

    const fragmentMatcher = new IntrospectionFragmentMatcher({
        introspectionQueryResultData
    });

    const client = new ApolloClient({
        link: PrismicLink({
            uri: graphqlEndpoint,
            accessToken: token
        }),
        cache: new InMemoryCache({ fragmentMatcher })
    });

    let allLayoutsData = {};
    const handler = async ({ code, iso }) => {
        const layoutData = await client
            .query({ query: layoutQuery, variables: { lang: iso } })
            .then(result => result.data);

        allLayoutsData = { ...allLayoutsData, [code]: layoutData };
    };

    // This function allows us to add a timeout between promises (not possible with Promise.all)
    await runPromisesSequence({ array: locales, handler });

    fs.ensureFileSync(path.join('cms', 'data', 'layout-data.json'));
    await fs
        .writeJSON(path.join('cms', 'data', 'layout-data.json'), allLayoutsData)
        .then(() => {
            logger.success('Layout data successfully extracted!');
        })
        .catch(err => {
            logger.error('Error writing layoutData file', err);
        });
};

export default initLayoutData;
