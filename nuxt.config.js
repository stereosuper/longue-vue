import dotenv from 'dotenv';
import path from 'path';
import OptimizeThreePlugin from '@vxna/optimize-three-webpack-plugin';

import enTranslation from './locales/en.json';
import frTranslation from './locales/fr.json';

dotenv.config();

export default {
    mode: 'universal',
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
     ** Customize the progress-bar color
     */
    loading: { color: '#fff' },
    /*
     ** Global CSS
     */
    css: ['@/assets/scss/main.scss'],
    /*
     ** Plugins to load before mounting the App
     */
    plugins: ['~/plugins/globals.js', '~/plugins/breakpoints.js'],
    /*
     ** Nuxt.js dev-modules
     */
    buildModules: [],
    /*
     ** Nuxt.js modules
     */
    modules: [
        // Doc: https://axios.nuxtjs.org/usage
        '@nuxtjs/axios',
        '@nuxtjs/dotenv',
        '@nuxtjs/style-resources',
        [
            'nuxt-i18n',
            {
                locales: ['en', 'fr'],
                strategy: 'prefix_except_default',
                defaultLocale: 'en',
                detectBrowserLanguage: false,
                routesNameSeparator: '-',
                parsePages: false, // Disable acorn parsing
                pages: {
                    'projects/index': {
                        en: '/projects',
                        fr: '/projets',
                    },
                    'projects/_project': {
                        en: '/projects/:project?',
                        fr: '/projets/:project?',
                    },
                    'experiments/index': {
                        en: '/experiments',
                        fr: '/experiences',
                    },
                    'experiments/_experiment': {
                        en: '/experiments/:experiment?',
                        fr: '/experiences/:experiment?',
                    },
                },
                vueI18n: {
                    fallbackLocale: 'en',
                    messages: {
                        en: enTranslation ? enTranslation : {},
                        fr: frTranslation ? frTranslation : {},
                    },
                },
                vuex: {
                    syncLocale: true,
                    syncMessages: true,
                    syncRouteParams: true,
                },
            },
        ],
        '~/modules/scrape',
    ],
    styleResources: {
        sass: [
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
            const routes = require('./assets/data/routes.json');
            return JSON.parse(routes);
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
                config.module.rules.push({
                    test: /\.(glsl|vs|fs|vert|frag)$/,
                    exclude: /node_modules/,
                    use: ['raw-loader', 'glslify-loader'],
                });
                config.module.rules.push({
                    test: /\.(mp3|ogg)$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: '[name].[ext]',
                                outputPath: 'songs',
                            },
                        },
                    ],
                });
                config.plugins.push(new OptimizeThreePlugin());
            }
        },
    },
};
