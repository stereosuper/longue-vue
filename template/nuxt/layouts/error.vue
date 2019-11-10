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
export default {
    props: {
        error: {
            type: Object,
            required: true
        }
    }
};
</script>

<style lang="scss" scoped></style>
