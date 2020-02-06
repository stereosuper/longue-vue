<template>
    <Home :cms-data="cmsData" />
</template>

<script>
import { getHome } from '~/cms';

import Home from '~/components/Pages/Home';

export default {
    components: {
        Home
    },
    async asyncData({ app, error, route, store }) {
        const { fullPath: routePath } = route;

        const cmsData = await getHome({ app, routePath, store });

        if (!cmsData) return error({ statusCode: 404 });

        return { cmsData };
    }
};
</script>

<style lang="scss" scoped></style>
