<template>
    <div class="loader" :class="{ loading: isLoading }" />
</template>

<script>
import { wait } from '@stereorepo/sac';

export default {
    data: () => ({
        startTime: null,
        minimumTime: 600
    }),
    computed: {
        isLoading() {
            return this.$store.state.loading;
        }
    },
    methods: {
        start() {
            this.startTime = new Date().getTime();
            this.$store.commit('setLoading', true);
        },
        async finish() {
            const endTime = new Date().getTime();
            const deltaTime = endTime - this.startTime;
            const remainingTime = this.minimumTime - deltaTime;
            if (remainingTime > 0) {
                await wait(remainingTime);
            }
            this.$store.commit('setLoading', false);
        }
    }
};
</script>

<style lang="scss" scoped>
.loader {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: $black;
    opacity: 0;
    pointer-events: none;
    @include z-index('loader');
    &.loading {
        opacity: 1;
    }
}
</style>
