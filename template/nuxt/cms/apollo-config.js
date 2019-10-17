import { PrismicLink } from 'apollo-link-prismic';
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import introspectionQueryResultData from './fragmentTypes.json';
import { graphqlEndpoint } from './cms.config.js';

export default () => {
    const token = process.env.PRISMIC_TOKEN;

    const fragmentMatcher = new IntrospectionFragmentMatcher({
        introspectionQueryResultData
    });

    return {
        link: PrismicLink({
            uri: graphqlEndpoint,
            accessToken: token
        }),
        cache: new InMemoryCache({ fragmentMatcher }),
        defaultHttpLink: false
    };
};
