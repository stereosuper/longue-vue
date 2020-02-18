import gql from 'graphql-tag';
import seoFields from '~/cms/fields/seoFields';
import allSlugsFields from '~/cms/fields/allSlugsFields';

export default gql`
    query BasicPage($lang: SiteLocale, $slug: String) {
        basicPage(locale: $lang, filter: { slug: { eq: $slug } }) {
            ${seoFields}
            ${allSlugsFields}
        }
    }
`;
