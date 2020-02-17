# The documentation 📝

[Alban 🔥] In here you will find all the elements you need to understand the project as a whole.

> 🚨 **Nota bene**  
> This documentation has been generated from the answers gathered during the project initialization.

## Table of contents ✅

### General information
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
-   [Init Layout Data Module](./custom-nuxt-modules/InitLayoutData.md)
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

