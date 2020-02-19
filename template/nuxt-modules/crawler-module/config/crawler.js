import gql from 'graphql-tag';

<%_ if(cms === 'prismic') { _%>
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
<%_ } _%>

export default gql`
    <%_ if(cms === 'dato') { _%>
    query Crawler($lang: SiteLocale) {
        allBasicPages(locale: $lang) {
            slug
            _modelApiKey
        }
        allDynamicSinglePages(locale: $lang) {
            slug
            _modelApiKey
        }
    }
    <%_ } _%>
    <%_ if(cms === 'prismic') { _%>
    query Crawler {
        _site {
            __typename
        }
    }
    <%_ } _%>
`;
