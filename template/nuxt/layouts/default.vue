<template>
    <div>
        <nuxt />
    </div>
</template>

<script>
export default {
    mounted() {
        <%_ if (stereorepoSac) { _%>
        this.$stereorepo.superWindow.initializeWindow(this.$store);
        <%_ } _%>
        this.$nextTick(() => {
            this.$store.commit('setLoading', false);
        });
    }
};
</script>

<style></style>
