import fs from 'fs-extra';
import path from 'path';
import logger from 'consola';
<%_ if (cms === 'dato') { _%>
import { createHttpLink } from 'apollo-link-http';
import fetch from 'node-fetch';
<%_ } else if (cms === 'prismic') { _%>
import { PrismicLink } from 'apollo-link-prismic';
<%_ } _%>
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';

import { graphqlEndpoint } from '../cms/cms.config.js';

const initFragmentMatcher = async () => {
    <%_ if (cms === 'dato') { _%>
    const token = process.env.DATO_TOKEN;
    
    const link = createHttpLink({
        fetch,
        uri: 'https://graphql.datocms.com/'
        headers:{
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
        },
    });
    <%_ } else if (cms === 'prismic') { _%>
    const token = process.env.PRISMIC_TOKEN;
    
    const link = PrismicLink({
        uri: graphqlEndpoint,
        accessToken: token
    });
    <%_ } _%>

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
