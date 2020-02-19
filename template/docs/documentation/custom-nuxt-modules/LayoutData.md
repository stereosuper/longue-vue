# Layout data 🗃

## The idea 😏

[Alban 🔥] The Nuxt `~/pages` directory will contain your website's routes. In those files you'll be able to get the data from your CMS on the server side 👌

Those routes will be called by your layout located in the `~/layouts` directory.

**But what if your layout needed that server side data fetching too ? 😂**

## HOW DO YOU DO THAT??? 😭

Well... if we can't do that at runtime... **LET'S DO THAT BEFORE THE WHOLE THING EVEN STARTS** 😂

The great way to do that is by loading your layout data before you even start the development server (or your pages generation).

To do that we use a Nuxt module.  
Why? Simply because modules are started before the server/generation process is running 👌

## Practical reality 🤔

### Dato CMS

In the `~/config/layout-data.js` file you'll
find two queries.

> 🚨 **Nota bene**  
> Those two queries' results will simply be written down in the `~/cms/data` directory.

#### layoutDataQuery

This one will be used to get all your CMS data corresponding to your header, footer, etc.

The output file will be located at `~/cms/data/layout-data.json`.

#### globalSeoQuery

The _globalSeoQuery_ will be used to get your default SEO data.

The output file will be located at `~/cms/data/global-seo-data.json`.

### Prismic

In the `~/config/layout-data.js` file you'll
find one query.

> 🚨 **Nota bene**  
> This query's results will simply be written down in the `~/cms/data` directory.

#### layoutDataQuery

This one will be used to get all your CMS data corresponding to your header, footer, etc.

The output file will be located at `~/cms/data/layout-data.json`.

## The things you don't really need to know but that you'll want to... because you're that curious 😂

This nuxt module is referenced in the _nuxt.config.js_ configuration file as a module (see the [modules documentation](https://nuxtjs.org/guide/modules)).

The _layoutDataQuery_ and the _globalSeoQuery_ are passed as module options, then the module takes care of everything.
