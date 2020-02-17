# Icon

## Introduction

The Icon component will allow you to create a svg referencing a symbol contained in `~/components/Miscellaneous/Svgs.vue`.

> 🚨 **Nota bene**  
> This component doesn't need to handle reactive data. Hence, it is a functional component (see the Vue.js documentation about [functional components](https://vuejs.org/v2/guide/render-function.html#Functional-Components)).

## Usage

```html
<template>
    <!-- The name attributes will match icon-[name] in the Svgs.vue file  -->
    <Icon name="logo" />
</template>
```

```js
<script>
import Icon from '~/components/Miscellaneous/Icon';

export default {
    ...
    components:{
        Icon
    },
    ...
}
</script>
```
