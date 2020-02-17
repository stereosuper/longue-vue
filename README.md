# 🔭 Create Longue Vue 🔭

> [Alban 🔥] Create a [Stéréosuper](https://www.stereosuper.fr/) Nuxt.js App like a beast

## Usage

Make sure you have [npx](https://www.npmjs.com/package/npx) installed (`npx` is shipped by default since [npm](https://www.npmjs.com/get-npm) `5.2.0`)

```bash
npx create-longue-vue <my-project>
```

Or starting with npm v6.1 you can do:

```bash
npm init longue-vue <my-project>
```

Or with [yarn](https://yarnpkg.com/en/):

```bash
yarn create longue-vue <my-project>
```

## Features 🎉

1. Choose your package manager 👌
    - Yarn
    - Npm
1. Choose your Netlify environment value:
    - Production 🚀
    - Preproduction 💅
    - Developement 🔨
1. Choose your CMS:
    - DatoCMS 😘
    - Prismic 💪
    - None 🤔
1. Choose your custom features :
    - [Crawler module](https://github.com/stereosuper/longue-vue/blob/master/template/docs/nuxt-modules/Crawler.md)
    - [Netlify lambda functions](https://github.com/stereosuper/longue-vue/blob/master/template/docs/netlify/Lambda.md)
    - [Progressive Web App (PWA) Support](https://pwa.nuxtjs.org)
    - [Redirections Module](https://github.com/stereosuper/longue-vue/blob/master/template/docs/nuxt-modules/Redirections.md)
    - [Static Data Module](https://github.com/stereosuper/longue-vue/blob/master/template/docs/nuxt-modules/StaticData.md)
1. Choose [Stéréorepo](https://github.com/stereosuper/stereorepo) modules ([Sac](https://github.com/stereosuper/stereorepo/tree/master/packages/sac) is included by default):
    - [Burger](https://github.com/stereosuper/stereorepo/tree/master/packages/burger)
1. Customize Sac configuration:
    - [Initialize SuperScroll](https://github.com/stereosuper/stereorepo/tree/master/packages/sac/src/components/SuperScroll)
1. Choose some packages:
    - [GSAP](https://greensock.com/gsap)

## CLI Options

### `--help`

Alias: `-h`. Show the help information and exit, include: usage, command and all cli options.

### `--verbose`

Show debug logs

### `--version`

Alias: `-v`. Show version number and exit.

## How to update the package

### Update version

You can update your package version by running `npm version`.

```sh
npm version [<newversion> | major | minor | patch
```

This command will only update your package, not publish it to npm.

### Publish a new version

To publish a new version of your package you just have to run `npm publish`.

```sh
npm publish
```

This command, unlike the preceding, will publish your new version on your npm repo.
