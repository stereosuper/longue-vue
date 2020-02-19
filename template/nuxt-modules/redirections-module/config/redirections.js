import gql from 'graphql-tag';

<%_ if(cms === 'prismic') { _%>
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
<%_ } _%>

export default gql`
    <%_ if(cms === 'dato') { _%>
    query Redirections {
        redirectionGroup {
            redirections {
                redirectionText
            }
        }
    }
    <%_ } _%>
    <%_ if(cms === 'prismic') { _%>
    query Redirections {
        _site {
            __typename
        }
    }
    <%_ } _%>
`;
