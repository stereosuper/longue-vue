// NOTE: Remove queries directory if it's not a graphql project

import gql from 'graphql-tag';

// NOTE: Query example with i18n
// Replace the example below with your homepage's graphql query
export default gql`
    query HomepageByLocale($lang: String) {
        _allDocuments(lang: $lang) {
            edges {
                node {
                    __typename
                }
            }
        }
    }
`;
