import gql from 'graphql-tag';

export default pageType => gql`
    query GetAllSlugs($lang: SiteLocale) {
        ${pageType}(locale: $lang) {
            _allSlugLocales {
                value
            }
        }
    }
`;
