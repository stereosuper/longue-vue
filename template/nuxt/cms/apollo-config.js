import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
<%_ if (cms === 'dato') { _%>
import { createHttpLink } from 'apollo-link-http';
import fetch from 'node-fetch';
<%_ } else if (cms === 'prismic') { _%>
import { PrismicLink } from 'apollo-link-prismic';
<%_ } _%>
import introspectionQueryResultData from './fragmentTypes.json';
import { graphqlEndpoint } from './cms.config.js';

export default () => {
    <%_ if (cms === 'dato') { _%>
    const token = process.env.DATO_TOKEN;
    
    const link = createHttpLink({
        fetch,
        uri: graphqlEndpoint,
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

    const fragmentMatcher = new IntrospectionFragmentMatcher({
        introspectionQueryResultData
    });

    return {
        link,
        cache: new InMemoryCache({ fragmentMatcher }),
        defaultHttpLink: false
    };
};
