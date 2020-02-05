import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import fetch from 'node-fetch';
import redirectionsQuery from './queries/redirectionsQuery';

export default async () => {
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

    return await client
        .query({ query: redirectionsQuery })
        .then(({ data }) =>
            data.redirectionGroup && data.redirectionGroup.redirections.length
                ? data.redirectionGroup.redirections.map(({ redirectionText }) => redirectionText)
                : []
        );
};
