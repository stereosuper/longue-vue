import gql from 'graphql-tag';

// NOTE: Query example with i18n
// Replace the example below with your homepage's graphql query
export default gql`
    query HomePage($lang: SiteLocale) {
        homePage: _site(locale: $lang) {
            __typename
        }
    }
`;
