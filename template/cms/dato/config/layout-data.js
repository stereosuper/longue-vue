import gql from 'graphql-tag';
import linkFragment from '../cms/fragments/linkFragment';

/**
 * NOTE: You can get your layout data from here
 * in order to avoid populating you store with a lot of data.
 * Your query will resemble something like the one below 👇
 */

export const layoutDataQuery = gql`
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

export const globalSeoQuery = gql`
    query GlobalSeo($lang: SiteLocale) {
        _site {
            globalSeo(locale: $lang) {
                facebookPageUrl
                siteName
                titleSuffix
                twitterAccount
                fallbackSeo {
                    description
                    title
                    twitterCard
                    image {
                        url
                        alt
                        width
                        height
                    }
                }
            }
        }
    }
`;
