<template>
    <div
        class="fit-image-container"
        :class="{
            loaded,
            cover: !contains,
            contains,
            fallback: objectFitFallback
        }"
    >
        <figure
            ref="image-wrapper"
            v-lazyload="{ lazyLoaded, lazyError }"
            class="fit-image-wrapper"
            :data-src="srcAttribute"
            :data-srcset="srcsetAttribute"
            :data-sizes="sizesAttribute"
            :data-alt="imageAlt"
        >
            <span
                v-if="objectFitFallback"
                ref="image-fallback"
                class="image-fallback"
                :style="{ backgroundImage: `url('${imageData.url}')` }"
            />
            <p v-if="imageData.metadata.copyright" class="copyright">
                {{ imageData.metadata.copyright }}
            </p>
        </figure>
    </div>
</template>

<script>
import { isIe11, isSafari } from '@stereorepo/sac';
import { resolveInputData, resolveSrcSet, resolveSrc, resolveSizes } from '~/assets/js/resolvers/image-resolver';

import ImageLazyLoadingDirective from '~/directives/ImageLazyLoadingDirective';

export default {
    directives: { lazyload: ImageLazyLoadingDirective },
    props: {
        image: {
            type: Object,
            required: true
        },
        contains: {
            type: Boolean,
            default: false
        },
        fullWidth: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            imageData: resolveInputData(this.image),
            sizes: Object.keys(this.$breakpoints.list),
            loaded: false,
            imageWrapper: null,
            srcsetAttribute: '',
            sizesAttribute: '',
            srcAttribute: '',
            currentWidth: 0,
            imageAlt: '',
            objectFitFallback: false,
            isSafari: false
        };
    },
    watch: {
        image() {
            this.srcsetAttribute = this.computeSrcSet();
            this.sizesAttribute = this.computeSizes();
            this.srcAttribute = this.computeSrc();
        }
    },
    created() {
        this.generateAlt();
    },
    mounted() {
        this.initialize();
        this.setMinHeight();
        this.objectFitFallback = isIe11();
        this.srcsetAttribute = this.computeSrcSet();
        this.sizesAttribute = this.computeSizes();
        this.srcAttribute = this.computeSrc();

        if (this.isSafari) this.lazyLoaded();
    },
    methods: {
        initialize() {
            this.imageWrapper = this.$refs['image-wrapper'];
            this.isSafari = isSafari();
        },
        generateAlt() {
            this.imageAlt = this.imageData.metadata.alt ? this.imageData.metadata.alt.replace(/"/g, '&quot;') : '';
        },
        async lazyLoaded() {
            this.$emit('lazy-loaded');
            this.loaded = true;
        },
        lazyError() {},
        computeSrcSet() {
            return resolveSrcSet({
                data: this.imageData,
                breakpoints: this.sizes,
                isFullWidth: this.fullWidth
            });
        },
        computeSizes() {
            return resolveSizes({
                data: this.imageData,
                breakpoints: this.sizes,
                isFullWidth: this.fullWidth
            });
        },
        computeSrc() {
            return resolveSrc({ data: this.imageData });
        },
        async setMinHeight() {
            if (this.loaded) return;
            const { height: originalHeight, width: originalWidth } = this.imageData.dimensions;
            const { width: currentWidth } = await this.$stereorepo.superDOM.measure(() =>
                this.imageWrapper.getBoundingClientRect()
            );
            this.currentWidth = currentWidth;
            const minHeight = (currentWidth / originalWidth) * originalHeight;

            await this.$stereorepo.superDOM.mutate(() => {
                this.imageWrapper.style.minHeight = `${minHeight}px`;
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.fit-image-container {
    position: relative;
    overflow: hidden;
    &::before,
    &::after {
        content: '';
        position: absolute;
        transition: transition(
            (
                opacity: $long-duration
            ),
            $ease-out-timing-function
        );
    }
    &::before {
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1;
        background: $black;
    }
    &::after {
        top: 50%;
        left: 50%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, rgba($white, 0) 0%, rgba($white, 0.75) 50%, rgba($white, 0) 100%);
        transform: translate(-50%, -50%);
        animation: image-loader 1s infinite;
        z-index: 2;
    }
    &.loaded {
        &::before,
        &::after {
            opacity: 0;
            animation: 0;
        }
    }
    &.cover {
        /deep/ .fit-image {
            object-fit: cover;
        }
        .image-fallback {
            background-size: cover;
        }
    }
    &.contains {
        /deep/ .fit-image {
            object-fit: contain;
        }
        .image-fallback {
            background-size: contain;
        }
    }
    &.fallback {
        &::before,
        &::after {
            opacity: 0;
            animation: 0;
        }
        .fit-image-wrapper {
            flex: 1 1 100%;
            position: relative;
        }
        /deep/ .fit-image {
            visibility: hidden;
        }
    }
}

.fit-image-wrapper {
    width: 100%;
    height: 100%;
}

/deep/ .fit-image {
    position: relative;
    width: 100%;
    height: 100%;
    z-index: 0;
}

.image-fallback {
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-position: center center;
    background-repeat: no-repeat;
    z-index: 1;
}

.copyright {
    margin: 0.5em 0;
    font-size: 1.2rem;
    color: $black;
}

@keyframes image-loader {
    0% {
        transform: translate(-150%, -50%);
    }
    100% {
        transform: translate(50%, -50%);
    }
}
</style>
