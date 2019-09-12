import dotenv from 'dotenv';
import path from 'path';

import enTranslation from './locales/en.json';
import frTranslation from './locales/fr.json';

dotenv.config();

const netlifyEnv = process.env.NODE_ENV;
const isDevEnv = netlifyEnv === 'development';
const websiteUrl =
    process.env.URL || `http://${process.env.HOST}:${process.env.PORT}`;

export default {
    mode: 'universal',
    /*
     ** Environnement variables shared for the client and server-side
     */
    env: { cmsToken: process.env.CMS_TOKEN, isDevEnv, websiteUrl },
    /*
     ** Headers of the page
     */
    head: {
        title: process.env.npm_package_name || '',
        meta: [
            { charset: 'utf-8' },
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1',
            },
            {
                hid: 'description',
                name: 'description',
                content: process.env.npm_package_description || '',
            },
        ],
        link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
    /*
     ** PWA config
     */
    pwa: {
        manifest: {
            name: 'My Business',
            lang: 'fr',
            theme_color: '#000000',
            ogTitle: 'My Business - Title',
            ogSiteName: 'My Business',
            ogUrl: 'https://my-business.fr',
            ogImage: {
                path: 'https://my-business.fr/img/my-business-og-image.png',
                width: '2000',
                height: '1550',
                type: 'image/png',
            },
            twitterCard: 'summary_large_image',
            twitterSite: '@MyBusiness',
            twitterCreator: '@MyBusiness',
        },
    },
    /*
     ** Customize the progress-bar
     */
    loading: '~/components/LoadingBar.vue',
    /*
     ** Global CSS
     */
    css: ['~/assets/scss/main.scss'],
    /*
     ** Plugins to load before mounting the App
     */
    plugins: ['~/plugins/globals.js', '~/plugins/breakpoints.js'],
    /*
     ** Nuxt.js dev-modules
     */
    buildModules: [
        '@nuxtjs/dotenv',
        // SEE: https://github.com/Atinux/nuxt-prismic-showcase/tree/master/modules
        '~/modules/crawler',
        '~/modules/static',
        '@nuxtjs/pwa',
        // Doc: https://nuxt-community.github.io/nuxt-i18n/
        [
            'nuxt-i18n',
            {
                locales: ['fr', 'en'],
                strategy: 'prefix_except_default',
                defaultLocale: 'fr',
                routesNameSeparator: '-',
                pages: {},
                vueI18n: {
                    fallbackLocale: 'fr',
                    messages: {
                        fr: frTranslation || {},
                        en: enTranslation || {},
                    },
                },
                vuex: {
                    syncLocale: true,
                    syncMessages: true,
                    syncRouteParams: true,
                },
            },
        ],
        '@nuxtjs/style-resources',
    ],
    /*
     ** Nuxt.js modules
     */
    modules: [
        // Doc: https://axios.nuxtjs.org/usage
        '@nuxtjs/axios',
    ],
    /*
     ** Nuxt Style Resources module configuration
     */
    styleResources: {
        scss: [
            '~/assets/scss/abstracts/_variables.scss',
            '~/assets/scss/abstracts/_functions.scss',
            '~/assets/scss/abstracts/_mixins.scss',
            '~/assets/scss/abstracts/_placeholders.scss',
        ],
    },
    /*
     ** Axios module configuration
     ** See https://axios.nuxtjs.org/options
     */
    axios: {},
    generate: {
        routes: () => {
            // Return the routes here
            // Example: 👇
            // const routes = require('./assets/data/routes.json');
            // return JSON.parse(routes);
        },
        fallback: '404.html',
    },
    /*
     ** Build configuration
     */
    build: {
        /*
         ** You can extend webpack config here
         */
        babel: {
            plugins: ['@babel/plugin-proposal-optional-chaining'],
        },
        /*
         ** Used to analyse chunks
         */
        analyze: isDevEnv
            ? {
                  analyzerMode: 'static',
              }
            : false,
        extend(config, ctx) {
            config.resolve.alias['vue'] = 'vue/dist/vue.common';
            // Run ESLint on save
            if (ctx.isDev && ctx.isClient) {
                config.devtool = '#source-map';
                config.module.rules.push({
                    enforce: 'pre',
                    test: /\.(js|vue)$/,
                    loader: 'eslint-loader',
                    include: [path.resolve(__dirname, 'assets', 'js')],
                    exclude: /(node_modules)/,
                    options: {
                        sourceMap: true,
                    },
                });
            }
        },
    },
};
