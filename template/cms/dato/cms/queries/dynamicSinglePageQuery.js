import gql from 'graphql-tag';
import seoFields from '~/cms/fields/seoFields';
import allSlugsFields from '~/cms/fields/allSlugsFields';

export default gql`
    query DynamicSinglePage($lang: SiteLocale, $slug: String) {
        dynamicSinglePage(locale: $lang, filter: { slug: { eq: $slug } }) {
            ${seoFields}
            ${allSlugsFields}
        }
    }
`;
