import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config();

import robotsOptions from './config/robots';

import { excludedRoutes } from './assets/js/constants';
import { defaultLocale, locales, getPagesList } from './config/i18n';
import frTranslation from './locales/fr.json';

<%_ if (features.crawlerModule && cms !== 'none') { _%>
import crawlerQuery from './config/crawler';
<%_ } _%>
<%_ if (features.redirectionsModule && cms !== 'none') { _%>
import redirectionsQuery from './config/redirections';
<%_ } _%>
<%_ if (features.staticDataModule && cms !== 'none') { _%>
import { blacklist as staticDataBlacklist } from './config/static-data';
<%_ } _%>

/*
 ** NOTE:
 ** The NODE_ENV will always be equal to 'production' when we generate
 ** the website. Thus, we don't have a dev/production env variable
 ** for the preproduction environnement.
 ** The NETLIFY_ENV variable allow us to set a dev/production variable
 ** totaly decorrelated from the NODE_ENV variable.
 ** SEE: https://www.netlify.com/docs/continuous-deployment/#environment-variables
 */
const netlifyEnv = process.env.NODE_ENV;
const isDevEnv = netlifyEnv === 'development';
const isProdEnv = netlifyEnv === 'production';
const websiteUrl = process.env.URL || `http://${process.env.HOST}:${process.env.PORT}`;

export default {
    mode: 'universal',
    /*
     ** Environnement variables shared for the client and server-side
     */
    env: { <%= cms %>Token: process.env.<%= cms.toUpperCase() %>_TOKEN, isDevEnv, isProdEnv, websiteUrl },
    /*
     ** Headers of the page
     */
    head: {
        title: process.env.npm_package_name || '',
        htmlAttrs: {
            lang: 'fr'
        },
        meta: [
            { charset: 'utf-8' },
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1'
            },
            { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
            {
                hid: 'author',
                name: 'author',
                content: 'Stéréosuper'
            },
            // COMBAK: Update open graph meta title
            {
                hid: 'og:title',
                property: 'og:title',
                content: 'My business'
            },
            // COMBAK: Update open graph meta site_name
            {
                hid: 'og:site_name',
                property: 'og:site_name',
                content: 'My business'
            },
            // COMBAK: Update open graph meta url
            {
                hid: 'og:url',
                property: 'og:url',
                content: 'https://my-business.fr'
            },
            // COMBAK: Update open graph meta image
            {
                hid: 'og:image',
                property: 'og:image',
                content: '/images/MyBusinessOgImage.png'
            },
            // COMBAK: Update open graph meta image:width
            {
                hid: 'og:image:width',
                property: 'og:image:width',
                content: '2000'
            },
            // COMBAK: Update open graph meta image:height
            {
                hid: 'og:image:height',
                property: 'og:image:height',
                content: '1550'
            },
            // COMBAK: Update open graph meta image:type
            {
                hid: 'og:image:type',
                property: 'og:image:type',
                content: 'image/png'
            },
            // COMBAK: Update open graph meta image:alt
            {
                hid: 'og:image:alt',
                property: 'og:image:alt',
                content: 'My business og image alt'
            },
            // COMBAK: Update open graph meta twitter:card
            {
                hid: 'twitter:card',
                name: 'twitter:card',
                content: 'summary_large_image'
            },
            // COMBAK: Update open graph meta twitter:site
            {
                hid: 'twitter:site',
                name: 'twitter:site',
                content: '@MyBusiness'
            },
            // COMBAK: Update open graph meta twitter:creator
            {
                hid: 'twitter:creator',
                name: 'twitter:creator',
                content: '@MyBusiness'
            },
            // COMBAK: Update open graph meta twitter:image
            {
                hid: 'twitter:image',
                name: 'twitter:image',
                content: '/images/MyBusinessOgImage.png'
            }
            // COMBAK: Uncomment and update real favicon generator tile color
            // {
            //     name: 'msapplication-TileColor',
            //     content: '#fff',
            // },
        ],
        link: [
            // COMBAK: Uncomment and update real favicon generator favicon 32x32
            // {
            //     rel: 'icon',
            //     type: 'image/png',
            //     sizes: '32x32',
            //     href: '/favicon-32x32.png',
            // },
            // COMBAK: Uncomment and update real favicon generator favicon 16x16
            // {
            //     rel: 'icon',
            //     type: 'image/png',
            //     sizes: '16x16',
            //     href: '/favicon-16x16.png',
            // },
            // COMBAK: Uncomment and update real favicon generator safari pinned tab
            // {
            //     rel: 'mask-icon',
            //     href: '/safari-pinned-tab.svg',
            //     color: '#fff',
            // },
        ]
    },
    /*
     ** Customize the progress-bar
     */
    loading: '~/components/Layout/Loader.vue',
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
     ** SEE: https://github.com/Atinux/nuxt-prismic-showcase/tree/master/modules
     */
    buildModules: [
        <%_ if (features.crawlerModule && cms !== 'none') { _%>
        '~/modules/crawler-module',
        <%_ } _%>
        <%_ if (features.redirectionsModule && cms !== 'none') { _%>
        '~/modules/redirections-module',
        <%_ } _%>
        <%_ if (features.staticDataModule) { _%>
        '~/modules/static-data-module',
        <%_ } _%>
    ],
    <%_ if (features.crawlerModule && cms !== 'none') { _%>
    /*
     ** Crawler configuration
     */
    crawler: {
        /**
         * The GraphQL query that will get all the slugs available for generation.
         * SEE: ~/config/crawler
         */
        query: crawlerQuery
    },
    <%_ } _%>
    <%_ if (features.redirectionsModule && cms !== 'none') { _%>
    /*
     ** Redirections configuration
     */
        redirections: {
        /**
         * The GraphQL query that will get all the redirections available.
         * SEE: ~/config/redirections
         */
        query: redirectionsQuery
    },
    <%_ } _%>
    <%_ if (features.staticDataModule) { _%>
    /*
        ** Static data module configuration
        */
    staticData: {
        /**
         * Blacklisting all the urls containing the strings below.
         * Those routes would not be static.
         * SEE: ~/config/static-data
         */
        blacklist: staticDataBlacklist
    },
    <%_ } _%>
    /*
     ** Generate configuration
     */
    generate: {
        fallback: '404.html',
        exclude: excludedRoutes(isProdEnv)
    },
    /*
     ** Nuxt.js modules
     */
    modules: [
        '@nuxtjs/dotenv',
        <%_ if (cms === 'dato' || cms === 'prismic') { _%>
        '~/modules/initFragmentMatcher',
        <%_ } _%>
        <%_ if (cms !== 'none') { _%>
        '~/modules/initLayoutData',
        <%_ } _%>
        '@nuxtjs/style-resources',
        // Doc: https://nuxt-community.github.io/nuxt-i18n/
        [
            'nuxt-i18n',
            {
                locales,
                strategy: 'prefix_except_default',
                defaultLocale,
                routesNameSeparator: '-',
                parsePages: false, // Disable acorn parsing
                pages: getPagesList(isProdEnv),
                vueI18n: {
                    fallbackLocale: defaultLocale,
                    messages: {
                        fr: frTranslation || {},
                    }
                },
                vuex: {
                    syncLocale: true,
                    syncMessages: true,
                    syncRouteParams: true
                }
            }
        ],
        <%_ if (features.pwa) { _%>
        '@nuxtjs/pwa',
        <%_ } _%>
        '@nuxtjs/sitemap',
        [
            '@nuxtjs/robots',
            robotsOptions({
                env: netlifyEnv,
                url: websiteUrl
            })
        ]
    ],
    <%_ if (features.pwa) { _%>
    /*
     ** PWA configuration
     */
    pwa: {
        // SEE: https://developer.mozilla.org/en-US/docs/Web/Manifest
        manifest: {
            name: 'My Business',
            short_name: 'My Business',
            // COMBAK: Update pwa description
            description: 'My Business app description',
            start_url: websiteUrl,
            display: 'standalone',
            lang: 'fr-FR',
            dir: 'ltr',
            theme_color: '#000000',
            background_color: '#000000',
            // COMBAK: Update pwa categories
            // W3C compliant categories list
            // SEE: https://github.com/w3c/manifest/wiki/Categories
            categories: [
                'branding',
                'business', // W3C compliant
                'design',
                'development',
                'lifestyle', // W3C compliant
                'music', // W3C compliant
                'personalization', // W3C compliant
                'social', // W3C compliant
                'website'
            ],
            // COMBAK: Update pwa screenshots
            screenshots: [
                {
                    src: `${websiteUrl}/images/MyBusinessOgImage.png`,
                    sizes: '2000x1550',
                    type: 'image/png'
                }
            ]
        },
        workbox: {
            runtimeCaching: [
                {
                    urlPattern: `${websiteUrl}/static-media/.*`,
                    handler: 'cacheFirst'
                }
            ]
        }
    },
    <%_ } _%>
    /*
     ** Nuxt Style Resources module configuration
     */
    styleResources: {
        scss: [
            '~/assets/scss/abstracts/_variables.scss',
            '~/assets/scss/abstracts/_animations.scss',
            '~/assets/scss/abstracts/_functions.scss',
            '~/assets/scss/abstracts/_mixins.scss',
            '~/assets/scss/abstracts/_placeholders.scss'
        ]
    },
    /*
     ** Sitemap configuration
     */
    sitemap: {
        hostname: websiteUrl,
        gzip: true,
        routes: () => {
            let routes = [];
            const routesPath = path.resolve(__dirname, 'dist/routes.json');
            const exists = fs.existsSync(routesPath);
            if (!exists) return routes;
            routes = require(routesPath);
            return routes;
        }
    },
    /*
     ** Build configuration
     ** You can extend webpack configuration here
     */
    build: {
        /*
         ** Used to analyse chunks
         */
        analyze: isDevEnv ? { analyzerMode: 'static' } : false,
        /*
        ** Transpile specific dependencies with Babel
         */
        transpile: [
            /@stereorepo/,
            <%_ if (packages.gsap) { _%>
            /gsap/,
            <%_ } _%>
        ],
        /*
         ** Nuxt SplitChunks configuration
         */
        splitChunks: {
            layouts: true,
            pages: true,
            commons: true
        },
        /*
         ** Webpack optimization configuration
         */
        optimization: {
            splitChunks: {
                cacheGroups: {
                    vendors: {
                        test: /node_modules[\\/]/,
                        minSize: 100000,
                        maxSize: 200000,
                        priority: 9,
                        name: true
                    }
                }
            }
        },
        extend(config, ctx) {
            config.resolve.alias['vue'] = 'vue/dist/vue.common';
            delete config.resolve.alias['@@'];
            delete config.resolve.alias['@'];

            // Run ESLint on save
            if (ctx.isDev && ctx.isClient) {
                config.devtool = 'source-map';
                config.module.rules.push({
                    enforce: 'pre',
                    test: /\.(js|vue)$/,
                    loader: 'eslint-loader',
                    include: [path.resolve(__dirname, 'assets', 'js')],
                    exclude: /(node_modules)/,
                    options: {
                        sourceMap: true
                    }
                });
            }
        }
    }
};
