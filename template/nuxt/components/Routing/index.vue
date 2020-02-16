<template>
    <nuxt-link v-if="link.type === 'from-cms'" :to="linkData.url" :aria-label="linkData.ariaLabel">
        {{ linkData.text }}
    </nuxt-link>
    <nuxt-link v-else-if="link.type === 'internal'" :to="linkData.url" :aria-label="linkData.ariaLabel">
        <slot />
    </nuxt-link>
    <a v-else-if="link.type === 'external'" :href="linkData.url" :aria-label="linkData.ariaLabel">
        <slot />
    </a>
</template>

<script>
import { resolveLinkData } from '~/assets/js/resolvers/link-resolver';

export default {
    props: {
        link: {
            type: Object,
            required: true
        }
    },
    data() {
        return { linkData: resolveLinkData({ link: this.link, localePath: this.localePath }) };
    },
    mounted() {
        if (!this.linkData) this.$destroy();
    }
};
</script>
