const seoHandler = ({ seoData, routePath }) => {
    const head = { htmlAttrs: {}, meta: [] };

    if (routePath) {
        const url = `${process.env.websiteUrl}${routePath}`;
        head.meta = [
            ...head.meta,
            {
                hid: 'og:url',
                property: 'og:url',
                content: url
            }
        ];
    }

    if (!seoData) return head;

    if (seoData.title) {
        const title = seoData.title;
        head.title = title;
        head.meta = [
            ...head.meta,
            { hid: 'og:title', property: 'og:title', content: title },
            { hid: 'twitter:title', name: 'twitter:title', content: title }
        ];
    }

    if (seoData.description) {
        const description = seoData.description;
        head.meta = [
            ...head.meta,
            { hid: 'description', name: 'description', content: description },
            {
                hid: 'og:description',
                property: 'og:description',
                content: description
            },
            {
                hid: 'twitter:description',
                name: 'twitter:description',
                content: description
            }
        ];
    }

    if (seoData.image) {
        const { url, alt, width, height } = seoData.image;

        head.meta = [
            ...head.meta,
            {
                hid: 'og:image',
                property: 'og:image',
                content: url
            },
            {
                hid: 'og:image:secure_url',
                property: 'og:image:secure_url',
                content: url
            },
            {
                hid: 'twitter:image',
                property: 'twitter:image',
                content: url
            },
            {
                hid: 'og:image:width',
                property: 'og:image:width',
                content: width
            },
            {
                hid: 'og:image:height',
                property: 'og:image:height',
                content: height
            },
            {
                hid: 'og:image:alt',
                property: 'og:image:alt',
                content: alt
            }
        ];
    }

    if (seoData.twitterCard) {
        head.meta = [
            ...head.meta,
            {
                hid: 'twitter:card',
                name: 'twitter:card',
                content: seoData.twitterCard
            }
        ];
    }

    return head;
};

export default seoHandler;
