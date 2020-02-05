import gql from 'graphql-tag';

// NOTE: Query example with i18n
// Replace the example below with your basic page's graphql query

// Example:
// query BasicPage($lang: SiteLocale, $slug: String) {
//     basicPage(locale: $lang, filter: { slug: { eq: $slug } }) {
//         # The rest of your query
//     }
// }

export default gql`
    query BasicPage($lang: SiteLocale) {
        basicPage: _site(locale: $lang) {
            __typename
        }
    }
`;
