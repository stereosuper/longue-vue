import fs from 'fs-extra';
import path from 'path';
import logger from 'consola';
import { PrismicLink } from 'apollo-link-prismic';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';

import { graphqlEndpoint } from '../cms/cms.config.js';

const initFragmentMatcher = async () => {
    const token = process.env.PRISMIC_TOKEN;

    const client = new ApolloClient({
        link: PrismicLink({
            uri: graphqlEndpoint,
            accessToken: token
        }),
        cache: new InMemoryCache()
    });

    const schemaResults = await client
        .query({
            query: gql`
                {
                    __schema {
                        types {
                            kind
                            name
                            possibleTypes {
                                name
                            }
                        }
                    }
                }
            `
        })
        .then(result => {
            return result;
        });

    // here we're filtering out any type information unrelated to unions or interfaces
    const filteredData = schemaResults.data.__schema.types.filter(type => type.possibleTypes !== null);
    schemaResults.data.__schema.types = filteredData;
    fs.ensureFileSync(path.join('cms', 'fragmentTypes.json'));
    await fs
        .writeJSON(path.join('cms', 'fragmentTypes.json'), schemaResults.data)
        .then(() => {
            console.log();
            logger.success('Fragment types successfully extracted!');
        })
        .catch(err => {
            logger.error('Error writing fragmentTypes file', err);
        });
};

export default initFragmentMatcher;
