import gql from 'graphql-tag';
import linkFragment from '../fragments/linkFragment';

/**
 * NOTE: You can get your layout data from here
 * in order to avoid populating you store with a lot of data.
 * Your query will resemble something like the one below 👇
 * To avoid apollo errors from an empty CMS we commented it.
 */

export default gql`
    ${linkFragment}
    query Layout($lang: SiteLocale) {
        header(locale: $lang) {
            menuLinks {
                ...link
            }
        }
        footer(locale: $lang) {
            entityTitle
        }
    }
`;
