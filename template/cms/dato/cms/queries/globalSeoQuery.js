import gql from 'graphql-tag';

export default gql`
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
