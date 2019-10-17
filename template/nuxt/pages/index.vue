<template>
    <div class="container">
        <div></div>
    </div>
</template>

<script>
import { getHome } from '~/cms';

export default {
    <%_ if (apollo && i18n) { _%>
    async asyncData({ app, store }) {
    <%_ } else if (apollo) { _%>
    async asyncData({ app }) {
    <%_ } else if (axios && cms === 'wordpress') { _%>
    async asyncData({ $axios }) {
    <%_ } _%>
        return {
            <%_ if (apollo && i18n) { _%>
            cmsData: getHome({ app, store })
            <%_ } else if (apollo) { _%>
            cmsData: getHome({ app })
            <%_ } else if (axios && cms === 'wordpress' ) { _%>
            cmsData: { home: getHome({ axios: $axios }) }
            <%_ } _%>
        };
    }
};
</script>

<style lang="scss" scoped>
</style>
