# The documentation 📝

[Alban 🔥] In here you will find all the elements you need to understand the project as a whole.

> 🚨 **Nota bene**  
> This documentation has been generated from the answers gathered during the project initialization.

## Table of contents ✅

### General information
👉 [See below](##General)

### General sections
<%_ if(cms !== "none") { _%>
-   [CMS](./cms)
<%_ } _%>
-   [Components](./components)
-   [Plugins](./plugins)

### Specific elements
<%_ if(features.crawlerModule) { _%>
-   [Crawler Module](./custom-nuxt-modules/Crawler.md)
<%_ } _%>
<%_ if(cms !== 'none') { _%>
-   [Layout Data Module](./custom-nuxt-modules/LayoutData.md)
<%_ } _%>
<%_ if(features.netlifyLambda) { _%>
-   [Netlify Lambda](./netlify/Lambda.md)
<%_ } _%>
<%_ if(features.redirectionsModule) { _%>
-   [Redirections Module](./custom-nuxt-modules/Redirections.md)
<%_ } _%>
<%_ if(features.staticDataModule) { _%>
-   [Static Data Module](./custom-nuxt-modules/StaticData.md)
<%_ } _%>


## General

### Exclude static routes

In order to exclude static routes you'll need to go to the _nuxt.config.js_ file.
In there find the _generate_ section. We'll take a look at the _exclude_ feature.

```js
/*
** Generate configuration
*/
generate: {
    fallback: '404.html',
    // We're calling the excludedStaticRoutes function which will return the routes to exclude.
    // SEE: ~/assets/js/constants/routes.js
    exclude: excludedStaticRoutes(isProdEnv)
},
```

Now let's take a look at the _routes.js_ file.

```js
// We'll prevent the dynamic route from being generated
const prodBlacklist = [/\/dynamic/];

const generalBlackList = [];

export const excludedStaticRoutes = (isProdEnv = process.env.isProdEnv) =>
    isProdEnv ? prodBlacklist : generalBlackList;
```

