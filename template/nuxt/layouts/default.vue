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
        this.$stereorepo.superWindow.initializeWindow(this.$store);
        this.$nextTick(() => {
            this.$store.commit('setLoading', false);
        });
    }
};
</script>

<style></style>
