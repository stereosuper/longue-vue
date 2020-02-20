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

        const cmsData = await getBasicPage({ app, routePath, store });

        if (!cmsData) return error({ statusCode: 404 });
        // Generate current page's seo head data
        const seo = handleSeo({ routePath, seoData: cmsData.seo, store });

        return { seo, isValidated, cmsData };
    },
    created() {
        /**
         * NOTE: Checking if the requested page's slug exists to validate the page's request.
         * We can't call the validateDynamicPage function in the validate method. Otherwise after generation the component will try to make an api call (which will send an 401 error).
         */
        if (!this.isValidated) this.$nuxt.error({ statusCode: 404 });
    },
    head() {
        return {
            ...this.seo
        };
    }
};
</script>

<style lang="scss" scoped></style>
