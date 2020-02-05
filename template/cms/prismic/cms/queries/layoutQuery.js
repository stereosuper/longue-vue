import gql from 'graphql-tag';

/**
 * NOTE: You can get your layout data from here
 * in order to avoid populating you store with a lot of data.
 * Your query will resemble something like the one below 👇
 * To avoid apollo errors from an empty CMS we commented it.
 */

// query Layout($lang: String) {
//     header(locale: $lang) {
//         __typename
//     }
//     footer(locale: $lang) {
//         __typename
//     }
// }

export default gql`
    query Layout($lang: String) {
        _allDocuments(lang: $lang) {
            edges {
                node {
                    __typename
                }
            }
        }
    }
`;
