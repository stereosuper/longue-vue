import gql from 'graphql-tag';

export default gql`
    query HomePage($lang: SiteLocale) {
        homePage(locale: $lang) {
            entityTitle
        }
    }
`;
