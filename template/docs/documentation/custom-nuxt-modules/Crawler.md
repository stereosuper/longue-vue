# Crawler 🌐

## The idea 😏

[Alban 🔥] Managing the routes list that Nuxt'll need to generate is not always easy depending on your project size.

### The need

I needed to easilly generate all the routes (static and dynamic localized routes 😭) with any given CMS.

### The solution

A black box... you won't need to know anything, to touch anything... just worry about the input you'll feed it with.

One single config file. The one and only file's output: a query 👌

## Practical reality

The config file is located at `~/config/crawler.js`.

By default it exports a GraphQL query. In this query you'll need to get all the dynamic pages (pages with a slug, not the pages corresponding to a static page. CMS ≠ Dynamic).

For all of those pages you'll have to provide two informations:

1. their slug
1. their api key/model

> 🚨 **Nota bene**  
> The api key/model is (or will need to be) referenced into the `~/assets/js/constants/routes.js` file. The _routeByApiModels_ and _routes_ objects inside of this file will be used as a bridge between your CMS and _nuxt-i18n_ (which is responsible for all the i18n in your project).

## You wan't to generate all the pages... but not that one 😂

I thinked about it... here's the solution:

### The blacklist

#### Handle static files

Inside the _nuxt.config.js_ file you'll be able to pass a _blacklist_ array.

```js
/*
** Crawler configuration
*/
crawler: {
    query: crawlerQuery, // We'll say that crawlerQuery is your GraphQL query.
    blacklist: [
        '/test',
        '/static-page-example',
    ]
},
```

#### Handle dynamic files

In order to exclude dynamic files you'll need to edit the i18n config file in `~/config/i18n.js`.

```js
// The isProdEnv variable will help you to set the dynamic pages to false in production
export const getPagesList = (isProdEnv = process.env.isProdEnv) => ({
    [routes.dynamicListPage.i18nFormat]: {
        // Conditionnal route example
        fr: !isProdEnv ? '/dynamic' : false
    },
    [routes.dynamicSinglePage.i18nFormat]: {
        // Conditionnal route example
        fr: !isProdEnv ? '/dynamic/:dynamic?' : false
    }
});
```

## The things you don't really need to know but that you'll want to... because you're that curious 😂

This nuxt module is referenced in the _nuxt.config.js_ configuration file as a build module (see the [build modules documentation](https://nuxtjs.org/api/configuration-modules#-code-buildmodules-code-)).

The _query_ is passed as a module option, then the module takes care of everything.
