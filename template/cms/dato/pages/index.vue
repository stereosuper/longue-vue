<template>
    <Home :cms-data="cmsData" />
</template>

<script>
import { getHome } from '~/cms';
import handleSeo from '~/assets/js/global/seo';

import Home from '~/components/Pages/Home';

export default {
    components: {
        Home
    },
    head() {
        return {
            ...this.seo
        };
    },
    async asyncData({ app, error, route, store }) {
        const { fullPath: routePath } = route;

        const cmsData = await getHome({ app, routePath, store });

        if (!cmsData) return error({ statusCode: 404 });

        // Generate current page's seo head data
        const seo = handleSeo({ routePath, seoData: cmsData.seo, store });

        return { seo, cmsData };
    }
};
</script>

<style lang="scss" scoped></style>
