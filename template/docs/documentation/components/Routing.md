# Routing

## Introduction

[Alban 🔥] The Routing component is pretty complex and advanced.

Firstly, it will some specific files:

-   Its route data resolver _link-resolver.js_
-   The _routes.js_ file

## The concept

The component will use _link-resolver.js_ to determine if the link will be a `nuxt-link` or a `<a href=""></a>` tag.

You can use this component in three different manners.

### From CMS

You can init the _Routing_ component as an internal link with it's data directly coming from your CMS.

### Internal

You can declare it as an internal link resolving a specific route defined in the _routes.js_ file.

### External

Last but not least you can use it to declare an external link a.k.a. `<a href=""></a>` tag.

## Usage

### From CMS

```html
<template>
    <Routing :link="{ data: cmsData.link, type: 'from-cms' }" />
</template>
```

### Internal

```html
<template>
    <!-- We'll assume that specificPage is declared in ~/assets/js/constants/routes -->
    <Routing
        :link="{
            data: {
                name: 'specificPage', ariaLabel: $t('specificPage.myInternalLink.ariaLabel')
            },
            type: 'internal'
        }"
    >
        {{ $t('specificPage.myInternalLink.text') }}
    </Routing>
</template>
```

> 🚨 **Nota bene**  
> The \$t method is coming from _vue-i18n_ (loaded by nuxt-i18n).  
> See the [formatting documentation](https://kazupon.github.io/vue-i18n/guide/formatting.html)

### External

```html
<template>
    <Routing
        :link="{
            data: { 
                url: 'https://google.fr', 
                ariaLabel: $t('specificPage.myExternalLink.ariaLabel')
            },
            type: 'external'
        }"
    >
        {{ $t('specificPage.myExternalLink.text') }}
    </Routing>
</template>
```

## The props

### ⚙️ link

Type: `Object`

Required: `true`

See the examples above, there's nothing more to know about that prop.

## The link resolver

The link resolver will determine how to handle the data passed to the _Routing_ component.

### resolveLinkData

A simple switch rerouting the logic to one of the three following functions.

It throws an error if an invalid type is passed in input.

### cmsLinkResolver

The biggest function of all.

It throws warnings if the neither one of external/internal toggles are selected in your CMS.

#### Internal link case

It will use the `localePath` function exposed by nuxt-i18n (see [the documentation](https://nuxt-community.github.io/nuxt-i18n/api/#methods)).

The route name matching is done based on the page's _slug_, its _\_modelApiKey_ and the route declared in the _routes.js_ file.

#### External link case

No matching, returning the external url coming from the CMS.

> 🚨 **Nota bene**  
> You'll need to update this function depending on the CMS used.

### internalLinkResolver

It will use the `localePath` function exposed by nuxt-i18n (see [the documentation](https://nuxt-community.github.io/nuxt-i18n/api/#methods)).

The route name matching is done based on the route declared in the _routes.js_ file.

### externalLinkResolver

Returning the external _url_ with its `aria-label`.
