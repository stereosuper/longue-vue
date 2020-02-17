import gql from 'graphql-tag';

/**
 * NOTE: You can get the slugs available for generation from here
 * Your query will resemble something like the one below 👇
 * To avoid apollo errors from an empty CMS we commented it.
 */

// query getAllSlugs($lang: SiteLocale) {
//     allBasicPages(locale: $lang) {
//         slug
//         _modelApiKey
//     }
// }

export default gql`
    query Redirections {
        _site {
            __typename
        }
    }
`;
