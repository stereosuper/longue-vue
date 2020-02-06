import { ApolloClient } from 'apollo-client';
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import { PrismicLink } from 'apollo-link-prismic';

import { graphqlEndpoint } from './cms';
import introspectionQueryResultData from '../cms/data/fragment-types.json';

const token = process.env.PRISMIC_TOKEN;

const fragmentMatcher = new IntrospectionFragmentMatcher({
    introspectionQueryResultData
});

const apolloClient = new ApolloClient({
    link: PrismicLink({
        uri: graphqlEndpoint,
        accessToken: token
    }),
    cache: new InMemoryCache({ fragmentMatcher })
});

export default apolloClient;
