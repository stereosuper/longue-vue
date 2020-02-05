<template>
    <div v-show="isActive" class="grid">
        <div class="container">
            <div v-for="columnIndex in columnsNumber" :key="columnIndex" class="column-block">
                <div class="column-text" />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        columnsData: { type: Object, required: true }
    },
    data: () => ({
        isActive: true,
        columnsNumber: 0
    }),
    computed: {
        windowWidth() {
            if (!this.$store.state.superWindow) return Infinity;
            return this.$store.state.superWindow.width;
        }
    },
    watch: {
        windowWidth() {
            this.computeColumns();
        }
    },
    mounted() {
        this.computeColumns();
        document.addEventListener('keydown', this.toggleGrid, false);
    },
    beforeDestroy() {
        // NOTE: Avoiding memory leaks
        document.removeEventListener('keydown', this.toggleGrid);
    },
    methods: {
        toggleGrid({ isComposing, keyCode }) {
            if (isComposing || keyCode === 229) return;
            // Letter G for grid
            if (keyCode !== 71) return;
            this.isActive = !this.isActive;
        },
        computeColumns() {
            const selectedBreakpoint = Object.entries(this.columnsData).reduce(
                (previousBreakpoint, [breakpoint]) =>
                    this.windowWidth >= this.$breakpoints.list[breakpoint] &&
                    this.$breakpoints.list[breakpoint] > this.$breakpoints.list[previousBreakpoint]
                        ? breakpoint
                        : previousBreakpoint,
                'xs'
            );

            this.columnsNumber = this.columnsData[selectedBreakpoint];
        }
    }
};
</script>

<style lang="scss" scoped>
.grid {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    z-index: 100;
}

.container {
    height: 100%;
    display: flex;
}

.column-block {
    width: 100%;
    padding: 0 $gutter;
    border-left: 1px solid $black;
    &:last-child {
        border-right: 1px solid $black;
    }
}

.column-text {
    width: 100%;
    height: 100%;
    border-left: 1px solid $black;
    &:last-child {
        border-right: 1px solid $black;
    }
}
</style>
