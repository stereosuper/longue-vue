import gql from 'graphql-tag';

export default gql`
    query getAllSlugs($lang: SiteLocale) {
        allBasicPages(locale: $lang) {
            slug
            _modelApiKey
        }
    }
`;
