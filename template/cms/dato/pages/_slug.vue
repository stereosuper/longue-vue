<template>
    <BasicPage :cms-data="cmsData" />
</template>

<script>
import { getBasicPage, validateDynamicPage } from '~/cms';
import handleSeo from '~/assets/js/global/seo';

import BasicPage from '~/components/Pages/BasicPage';

export default {
    components: {
        BasicPage
    },
    async asyncData({ app, error, route, store }) {
        const { fullPath: routePath, name: routeName } = route;
        const isValidated = await validateDynamicPage({ app, routePath, routeName, store });
        if (!isValidated) return error({ statusCode: 404 });

        const cmsData = await getBasicPage({ app, routePath, store });

        if (!cmsData) return error({ statusCode: 404 });
        // Generate current page's seo head data
        const seo = handleSeo({ routePath, seoData: cmsData.seo, store });

        return { seo, cmsData };
    },
    head() {
        return {
            ...this.seo
        };
    }
};
</script>

<style lang="scss" scoped></style>
