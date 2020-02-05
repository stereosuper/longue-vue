<template>
    <div
        class="fit-image-container"
        :class="{
            loaded,
            cover: !contains,
            contains,
            'black-background': blackLoaderBackground,
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
                :style="{ backgroundImage: `url('${image.url}')` }"
            />
            <p v-if="image.copyright" class="copyright">
                {{ image.copyright }}
            </p>
        </figure>
    </div>
</template>

<script>
import { isIe11, isSafari } from '@stereorepo/sac';
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
        },
        blackLoaderBackground: { type: Boolean, default: false }
    },
    data() {
        return {
            loaded: false,
            imageWrapper: null,
            srcsetAttribute: '',
            sizesAttribute: '',
            srcAttribute: '',
            currentWidth: 0,
            containerWidth: this.$breakpoints.list.threexl,
            sizes: [
                this.$breakpoints.list.s,
                this.$breakpoints.list.m,
                this.$breakpoints.list.l,
                this.$breakpoints.list.xl,
                this.$breakpoints.list.xxl,
                this.$breakpoints.list.threexl
            ],
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
            this.imageAlt = this.image.alt ? this.image.alt.replace(/"/g, '&quot;') : '';
        },
        async lazyLoaded() {
            this.$emit('lazy-loaded');
            this.$stereorepo.superScroll.update();
            this.loaded = true;
        },
        lazyError() {},
        datoImgix(url) {
            return `${url}?lossless=true&fm=${isSafari || isIe11 ? 'png' : 'webp'}&auto=format`;
        },
        computeSrcSet() {
            let srcset = '';
            const sizesLength = this.sizes.length;

            this.sizes.forEach((width, index) => {
                const { url } = this.image;
                const resizeUrl = `${this.datoImgix(url)}&w=${width}`;

                srcset += `${resizeUrl} ${width}w`;
                srcset += sizesLength - 1 === index ? '' : ', ';
            });

            // full
            if (this.fullWidth) {
                srcset += `, ${this.image.url} ${this.image.width}w`;
            }
            return srcset;
        },
        computeSizes() {
            let sizes = '';
            const sizesLength = this.sizes.length;

            this.sizes.forEach((width, index) => {
                sizes += `(max-width: ${width}px) ${width}px`;
                sizes += sizesLength - 1 === index ? '' : ', ';
            });

            // full
            if (this.fullWidth) {
                sizes += `, (max-width: ${this.image.width}px) ${this.image.width}px`;
            }
            return sizes;
        },
        computeSrc() {
            let src = '';
            const { url } = this.image;
            src = this.datoImgix(url);
            return src;
        },
        async setMinHeight() {
            if (this.loaded) return;
            const { height: originalHeight, width: originalWidth } = this.image;
            const { width: currentWidth } = await this.$stereosuper.fastdom.measure(() =>
                this.imageWrapper.getBoundingClientRect()
            );
            this.currentWidth = currentWidth;
            const minHeight = (currentWidth / originalWidth) * originalHeight;

            await this.$stereosuper.fastdom.mutate(() => {
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
        background: $light-gray;
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
    &.black-background {
        &::before {
            background: $black;
        }
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
