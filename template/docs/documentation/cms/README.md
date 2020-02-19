# The CMS directory

## Forewords

[Alban 🔥] In there you'll find the files responsible for getting data from your CMS.

There is five main parts in the directory :

-   The _data_ directory
-   The _fields_ directory
-   The _fragments_ directory
-   The _queries_ directory
-   The _index.js_ file

### The _data_ directory

Firstly, the directory doesn't exist before you run `npm run dev` or `npm run generate`.

During Nuxt initialization the data directory will be created and filled with json files.

Those files contains your [layout data](../custom-nuxt-modules/InitLayoutData.md) like header data, footer data... any data you got with the layout directory actually.

### The _fields_ directory

This directory contains every GraphQL specific and redundant fields used in your GraphQL queries.

### The _fragments_ directory

This directory contains every GraphQL fragments used in your GraphQL queries.

### The _queries_ directory

This directory contains every GraphQL queries used in your Nuxt pages.

### The _index.js_ file

The _index.js_ file contains every functions you'll use to get your data inside your Nuxt pages

## The functions

### getLocaleIso function

With this function you'll be able to get the locale iso code for your cms queries.

This function will vary depending on the CMS you're using. For example Prismic will need iso tag parsing to transform 'fr_FR' to 'fr-fr'.

### getSlug function

It will return the current page's slug. You'll need to use this function every time you wanna get a dynamic page.

### storeSlugs method

This function will dispatch the action "_i18n/setRouteParams_" to the i18n store module.

If you do forget to call _storeSlugs_ during your dynamic page loading, your lang switcher won't work correctly.

The _switchLocalePath_ method used to create a lang switcher (see [nuxt i18n doc](https://nuxt-community.github.io/nuxt-i18n/lang-switcher.html#dynamic-route-parameters)) will need you to provide the pages' slugs as early as possible.

### makeQuery function

This function will fetch your page's data. _getLocaleIso_ will be used under the hood if you're trying to load a dynamic page.
Finally the function will return your page's data.

### validateDynamicPage function

This function will help you throw a 404 page. I recommend you to use it inside your dynamic page's _asyncData_ function.

Example:

```js
// ~/pages/dynamic-page.vue
...
async asyncData({ app, error, route, store }) {
    const { fullPath: routePath } = route;
    const isValidated = await validatePage({ app, routePath, store });
    if (!isValidated) return error({ statusCode: 404 });

    // Your page slug has been validated ✅
    // Do whatever you need to do 🚀
}
...
```

## Pages getters

I recommend you to expose getters for each page.

### Static page example

```js
export const getStaticPage = async ({ app, store }) => {
    // ~/pages/static graphql query call
    // SEE: ~/cms/queries/staticPageQuery
    const cmsData = await makeQuery({ app, query: staticPageQuery, store });

    return Object.freeze(cmsData);
};
```

### Dynamic page example

```js
export const getDynamicPage = async ({ app, slug, store }) => {
    // ~/pages/_dynamic graphql query call
    // SEE: ~/cms/queries/dynamicPageQuery
    const { dynamicPage } = await makeQuery({
        app,
        query: dynamicPageQuery,
        slug,
        store
    });

    if (dynamicPage) {
        // NOTE: ⚠️ Do not forget to call storeSlugs to translate pages slugs
        await storeSlugs({ app, pageContent: dynamicPage, store });
    }

    return Object.freeze(dynamicPage);
};
```

### Object.freeze ??? 🤔

You probably noticed the use of

```js
return Object.freeze(cmsData);
```

I recommend you to use this on the Object that won't ever be mutated... like CMS data objects.

The _freeze_ method will block any attempt to mutate the object. "Freezing" the object will increase performances because the js engine now knows it will never need to mutate the object's attributes.
