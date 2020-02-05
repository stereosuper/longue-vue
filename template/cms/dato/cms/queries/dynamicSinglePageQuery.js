import gql from 'graphql-tag';

// NOTE: Query example with i18n
// Replace the example below with your dynamic single page's graphql query

// Example:
// query DynamicSinglePage($lang: SiteLocale, $slug: String) {
//     dynamicPage(locale: $lang, filter: { slug: { eq: $slug } }) {
//         # The rest of your query
//     }
// }

export default gql`
    query DynamicSinglePage($lang: SiteLocale) {
        dynamicPage: _site(locale: $lang) {
            __typename
        }
    }
`;
