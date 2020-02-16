<template>
    <Routing v-bind="$props" v-on="$listeners">
        <slot />
    </Routing>
</template>

<script>
import Routing from '.';

export default {
    components: { Routing },
    props: {
        ...Routing.props
    }
};
</script>

<style lang="scss" scoped></style>
