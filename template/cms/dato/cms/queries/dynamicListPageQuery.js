import gql from 'graphql-tag';

// NOTE: Query example with i18n
// Replace the example below with your dynamic list page's graphql query
export default gql`
    query DynamicListPage($lang: SiteLocale) {
        dynamicListPage: _site(locale: $lang) {
            __typename
        }
    }
`;
