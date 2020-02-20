<template>
    <div class="error container">
        <div class="error-text">
            <header class="error-header">
                <h1 class="h1">
                    {{ error.statusCode }}
                </h1>
            </header>
        </div>
    </div>
</template>

<script>
import { getErrorPage } from '~/cms';

export default {
    props: {
        error: {
            type: Object,
            required: true
        }
    },
    data: () => ({ errorData: null }),
    created() {
        this.getNotFoundData();
    },
    methods: {
        async getNotFoundData() {
            this.errorData = await getErrorPage({ app: this, store: this.$store });
        }
    }
};
</script>

<style lang="scss" scoped></style>
