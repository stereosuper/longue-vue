<template>
    <div>
        <Loader />
        <Header />
        <nuxt />
        <Footer />
        <Svgs />
        <Grid v-if="isDevEnv" :columns-data="columnsData" />
    </div>
</template>

<script>
import { ioPolyfill } from '@stereorepo/sac';

import Loader from '~/components/Layout/Loader';
import Header from '~/components/Layout/Header';
import Footer from '~/components/Layout/Footer';
import Svgs from '~/components/Miscellaneous/Svgs';

// Lazy loaded resources
const Grid = () => import('~/components/Layout/Grid');

export default {
    components: { Footer, Header, Grid, Loader, Svgs },
    data: () => ({
        isDevEnv: process.env.isDevEnv,
        columnsData: {
            xl: 6,
            s: 4,
            xs: 3
        }
    }),
    mounted() {
        this.handleWindow();
        <%_ if (sacConfig.superScroll) { _%>
        this.handleScroll();
        <%_ } _%>
        this.$nextTick(() => {
            this.$store.commit('setLoading', false);
        });
    },
    beforeDestroy() {
        // NOTE: Avoiding memory leaks
        <%_ if (sacConfig.superScroll) { _%>
        this.$stereorepo.superScroll.destroyScroll();
        <%_ } _%>
        this.$stereorepo.superWindow.destroyWindow(this.$store);
    },
    methods: {
        handleDevicesCompatibility() {
            /**
             * NOTE: The Intersection Observer API is used by
             *  LazyImage and LazyVideo directives.
             */
            ioPolyfill();
        },
        handleWindow() {
            this.$stereorepo.superWindow.initializeWindow(this.$store);
        },
        <%_ if (sacConfig.superScroll) { _%>
        handleScroll() {
            this.$stereorepo.superScroll.initializeScroll().then(firstScrollTop => {
                this.$store.commit('scroll/setFirstScrollTop', firstScrollTop);
            });

            this.$stereorepo.superScroll.on('scroll', scrollTop => {
                this.$store.commit('scroll/setScrollTop', scrollTop);
            });
        }
        <%_ } _%>
    }
};
</script>

<style></style>
