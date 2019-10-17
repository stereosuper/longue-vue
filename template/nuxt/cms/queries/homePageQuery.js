// NOTE: Remove queries directory if it's not a graphql project

import gql from 'graphql-tag';

// NOTE: Query example with i18n
// Replace the example below with your homepage's graphql query
export default gql`
query HomepageByLocale($lang: String) {
    allHomepages(lang: $lang) {
        edges {
            node {
                # Get your data here
            }
        }
    }
}
`;
