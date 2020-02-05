import { ApolloClient } from 'apollo-client';
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';

import { graphqlEndpoint, graphqlEndpointPreview } from './cms';
import introspectionQueryResultData from '../cms/data/fragment-types.json';

// Polyfills
import fetch from 'node-fetch';

const token = process.env.DATO_TOKEN;

const link = createHttpLink({
    fetch,
    uri: process.env.isDevEnv ? graphqlEndpointPreview : graphqlEndpoint,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
    }
});

const fragmentMatcher = new IntrospectionFragmentMatcher({
    introspectionQueryResultData
});

const apolloClient = new ApolloClient({
    link,
    cache: new InMemoryCache({ fragmentMatcher }),
    defaultHttpLink: false
});

export default apolloClient;
