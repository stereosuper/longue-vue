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
    head() {
        return {
            ...this.seo
        };
    },
    async asyncData({ app, error, route, store }) {
        const { fullPath: routePath, name: routeName } = route;
        const isValidated = await validateDynamicPage({ app, routePath, routeName, store });
        if (!isValidated) return error({ statusCode: 404 });

        const cmsData = await getDynamicSingle({ app, routePath, store });

        if (!cmsData) return error({ statusCode: 404 });

        // Generate current page's seo head data
        const seo = handleSeo({ routePath, seoData: cmsData.seo, store });

        return { seo, cmsData };
    }
};
</script>

<style lang="scss" scoped></style>
