<template>
    <div>
        <nuxt />
    </div>
</template>

<script>
export default {
    mounted() {
        this.$stereorepo.superWindow.initializeWindow(this.$store);
        this.$nextTick(() => {
            this.$store.commit('setLoading', false);
        });
    }
};
</script>

<style></style>
