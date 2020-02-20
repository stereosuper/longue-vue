<template>
    <DynamicSingle :cms-data="cmsData" />
</template>

<script>
import { getDynamicSingle, validateDynamicPage } from '~/cms';
import handleSeo from '~/assets/js/global/seo';

import DynamicSingle from '~/components/Pages/DynamicSingle';

export default {
    components: {
        DynamicSingle
    },
    async asyncData({ app, error, route, store }) {
        const { fullPath: routePath } = route;
        const cmsData = await getDynamicSingle({ app, routePath, store });

        if (!cmsData) return error({ statusCode: 404 });

        // Generate current page's seo head data
        const seo = handleSeo({ routePath, seoData: cmsData.seo, store });

        return { seo, cmsData };
    },
    // NOTE: Checking if the requested page's slug exists to validate the page's request
    async validate({ app, route, store }) {
        const { fullPath: routePath, name: routeName } = route;
        return await validateDynamicPage({ app, routePath, routeName, store });
    },
    head() {
        return {
            ...this.seo
        };
    }
};
</script>

<style lang="scss" scoped></style>
