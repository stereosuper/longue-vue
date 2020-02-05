import gql from 'graphql-tag';

/**
 * NOTE: You can get your netlify redirections instructions from here
 * Your query will resemble something like the one below 👇
 * To avoid apollo errors from an empty CMS we commented it.
 */

// query Redirections {
//     redirectionGroup {
//         redirections {
//             redirectionText
//         }
//     }
// }

export default gql`
    query Redirections {
        _site {
            __typename
        }
    }
`;
