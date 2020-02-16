import fs from 'fs-extra';
import path from 'path';
import logger from 'consola';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';
import { createHttpLink } from 'apollo-link-http';
import fetch from 'node-fetch';

const initFragmentMatcher = async () => {
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

    const client = new ApolloClient({
        link,
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
    fs.ensureFileSync(path.join('cms', 'data', 'fragment-types.json'));
    await fs
        .writeJSON(path.join('cms', 'data', 'fragment-types.json'), schemaResults.data)
        .then(() => {
            logger.success('Fragment types successfully extracted');
        })
        .catch(err => {
            logger.error('Error writing fragment types file', err);
        });
};

export default initFragmentMatcher;
