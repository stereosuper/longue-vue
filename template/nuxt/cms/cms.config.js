<%_ if (cms === 'dato') { _%>
export const apiEndpoint = '';
export const graphqlEndpoint = 'https://graphql.datocms.com/';
export const graphqlEndpointPreview = 'https://graphql.datocms.com/preview';

export default {
    apiEndpoint,
    graphqlEndpoint,
    graphqlEndpointPreview
};
<%_ } else if (cms === 'prismic') { _%>
export const apiEndpoint = 'https://<%= name %>.cdn.prismic.io/api/v2';
export const graphqlEndpoint = 'https://<%= name %>.prismic.io/graphql';

export default {
    apiEndpoint,
    graphqlEndpoint,
};
<%_ } else if (cms === 'wordpress') { _%>
export const apiBase = `${process.env.CMS_URL}/wp-json`;
export const wpApiEndpoint = `${apiBase}/wp/v2`;
export const acfApiEndpoint = `${apiBase}/acf/v3`;
export const customApiEndpoint = `${apiBase}/<%= name %>/v1`;

export default {
    apiBase,
    wpApiEndpoint,
    acfApiEndpoint,
    customApiEndpoint,
};
<%_ } else { _%>
export const apiEndpoint = '';
export const graphqlEndpoint = '';

export default {
    apiEndpoint,
    graphqlEndpoint
};
<%_ } _%>
