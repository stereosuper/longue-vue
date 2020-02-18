import gql from 'graphql-tag';

export default gql`
    query DynamicListPage($lang: SiteLocale) {
        dynamicListPage(locale: $lang) {
            entityTitle
        }
    }
`;
