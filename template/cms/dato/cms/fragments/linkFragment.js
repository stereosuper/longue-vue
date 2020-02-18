export default `
    fragment link on LinkRecord {
        linkLabel
        linkTitle
        isExternal
        externalLink
        isInternal
        internalLink {
            ... on BasicPageRecord {
                slug
                _modelApiKey
            }
        }
    }
`;
