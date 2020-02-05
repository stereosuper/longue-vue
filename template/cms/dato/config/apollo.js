import { ApolloClient } from 'apollo-client';
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';

import { graphqlEndpoint, graphqlEndpointPreview } from './cms';
import introspectionQueryResultData from '../cms/data/fragment-types.json';

// Polyfills
import es6Promise from 'es6-promise';
import fetchPolyfill from 'isomorphic-fetch';
import fetch from 'node-fetch';
es6Promise.polyfill();

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
