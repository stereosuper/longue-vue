import gql from 'graphql-tag';

// NOTE: Query example with i18n
// Replace the example below with your error page's graphql query
export default gql`
    query ErrorPage($lang: SiteLocale) {
        errorPage: _site(locale: $lang) {
            __typename
        }
    }
`;
