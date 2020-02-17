# LazyImage

## Introduction

[Alban 🔥] The Lazy Image component is pretty complex and advanced.

Firstly, it will use two specific files:

-   The Vue.js directive _ImageLazyLoadingDirective_
-   Its url data resolver _image-resolver.js_

## The concept

The component will use _image-resolver.js_ to normalize its input data, generate the _src_, _srcset_ and _sizes_ attributes.

Meanwhile, it will handle its alt attribute and set the image's `min-height`... because the component will lazy load the image 🔥

The _ImageLazyLoadingDirective_ will then add the image to the DOM with the _src_, _srcset_ and _sizes_ attributes.

> 🦄 **Bonus** 🦄  
> The LazyImage component uses the css `object-fit` property. This property is not handled properly by Internet Explorer... which is why it automatically fallbacks to a `background-image` property in this case 🔥

## Usage

```html
<template>
    <LazyImage :image="data.imageData" />
</template>
```

```js
<script>
import LazyImage from '~/components/Medias/LazyImage';

export default {
    ...
    components: {
        LazyImage
    },
    ...
}
</script>
```

## The props

### ⚙️ _image_

Type: `Object`

Required: `true`

That's the entry point, just put your image's data in there and watch as the magic begins.

### ⚙️ contain

Type: `Boolean`

Default value: `false`

By default the `object-fit` property is set to `cover`. To put it to contain just pass the props `contain` to the component.

Example:

```html
<template>
    <LazyImage :image="data.imageData" contain />
</template>
```

### ⚙️ full-width

Type: `Boolean`

Default value: `false`

By default the _srcset_ and _sizes_ attributes will be optimized. The resolver will compare the image tag's width to all the images' width versions available. Consequently it'll take all the version below or equal to the image tag's width.

To override this process you can use the `full-width` props. The element will then take all the sizes possible into account.

Example:

```html
<template>
    <LazyImage :image="data.imageData" full-width />
</template>
```

## The image resolver

The image resolver is located at `'~/assets/js/resolvers/image-resolver'`.

### resolveInputData

This method will normalize the data passed to the props `image`;

### resolveSrc

This method will resolve the image's _src_ by taking the original image url as an input.

### resolveSrcSet

This method will resolve the image's _srcset_.

> 🚨 **Nota bene**  
> You'll need to update this function depending on the CMS used.

### resolveSizes

This method will resolve the image's _sizes_.

> 🚨 **Nota bene**  
> You'll need to update this function depending on the CMS used.

## The directive

The _ImageLazyLoadingDirective_ directive will initialize an Intersection Observer instance to lazy load the image.

When the lazy loaded method is called the directive will call one of the two callback methods: _lazyLoaded_ or _lazyError_.
