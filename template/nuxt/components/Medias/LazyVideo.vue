<template>
    <div
        ref="video-wrapper"
        class="video-wrapper"
        :class="{ 'with-play-button': playButton }"
        :style="`min-height:${minHeight}px;`"
    >
        <transition-group v-if="!started" name="start-video">
            <button key="1" class="play-button" type="button" @click="playVideo">
                <span class="play-symbol" />
            </button>
            <LazyImage
                v-if="playerData.thumbnail"
                key="2"
                class="thumbnail"
                :image="playerData.thumbnail"
                :class="started"
            />
        </transition-group>
        <!-- Without playsinline attribute Safari won't autoplay the video  -->
        <!-- preload="none" is important for performances  -->
        <video
            ref="video"
            v-lazyload="{ lazyLoaded, lazyError }"
            class="video"
            :controls="controls"
            :autoplay="playerData.autoplay"
            :muted="playerData.autoplay || playerData.muted"
            :loop="playerData.loop"
            preload="none"
            playsinline
            :poster="playerData.thumbnail.url"
            :data-src="playerData.video.url"
        />
    </div>
</template>

<script>
import { requestTimeout } from '@stereorepo/sac';
import { resolveInputData } from '~/assets/js/resolvers/video-resolver';

import VideoLazyLoadingDirective from '~/directives/VideoLazyLoadingDirective';
import LazyImage from '~/components/Medias/LazyImage';

export default {
    directives: { lazyload: VideoLazyLoadingDirective },
    components: { LazyImage },
    props: {
        player: { type: Object, required: true },
        start: { type: Boolean, default: false },
        pause: { type: Boolean, default: true },
        controls: { type: Boolean, default: false },
        playButton: { type: Boolean, default: false }
    },
    data() {
        return {
            playerData: resolveInputData(this.player),
            videoElement: null,
            started: false,
            readyToPlay: false,
            videoWatcher: null,
            inView: true,
            minHeight: 0
        };
    },
    computed: {
        windowWidth() {
            if (!this.$store.state.superWindow) return Infinity;
            return this.$store.state.superWindow.width;
        }
    },
    watch: {
        windowWidth() {
            this.setVideoSize();
        },
        start() {
            this.playVideo();
        },
        pause() {
            this.pauseVideo();
        },
        inView(state) {
            if (state && this.playerData.autoplay) this.playVideo;
        }
    },
    created() {
        if (!this.$stereorepo.superScroll)
            throw new Error(
                'The lazy video module will not work without the SuperScroll component. See https://github.com/stereosuper/stereorepo/tree/master/packages/sac/src/components/SuperScroll'
            );
    },
    mounted() {
        this.setVideoSize();
        this.initialize();
        this.initializeWatcher();
    },
    beforeDestroy() {
        // NOTE: Avoiding memory leaks
        this.$stereorepo.superScroll.forgetMultiple([this.videoWatcher]);
    },
    methods: {
        async setVideoSize() {
            const {
                dimensions: { height: originalHeight, width: originalWidth }
            } = this.playerData.video;

            const { width: currentWidth } = await this.$stereorepo.superDOM.measure(() =>
                this.videoWrapper.getBoundingClientRect()
            );
            this.currentWidth = currentWidth;
            this.minHeight = Math.round((currentWidth / originalWidth) * originalHeight);
            this.$nextTick(() => {
                this.$stereorepo.superScroll.update();
            });
        },
        initialize() {
            this.videoWrapper = this.$refs['video-wrapper'];
            this.videoElement = this.$refs.video;

            // Video events
            this.videoElement.addEventListener(
                'canplay',
                () => {
                    this.readyToPlay = true;
                },
                false
            );

            this.videoElement.addEventListener(
                'loadedmetadata',
                () => {
                    this.readyToPlay = true;
                },
                false
            );

            // Handle autoplay
            this.videoElement.addEventListener('playing', this.handleFirstPlay, false);

            if (this.playerData.autoplay) this.playVideo();
        },
        lazyLoaded() {},
        lazyError() {},
        initializeWatcher() {
            this.videoWatcher = this.$stereorepo.superScroll
                .watch({ element: this.videoWrapper, options: { stalk: false, triggerOffset: '20%' } })
                .on('enter-view', () => {
                    this.inView = true;
                });
        },
        handleFirstPlay() {
            // First play handled
            this.videoElement.removeEventListener('playing', this.handleFirstPlay, false);

            this.playVideo();
        },
        playVideo() {
            if (this.started) return;
            if (this.readyToPlay) {
                const playPromise = this.videoElement.play() || Promise.reject('');
                playPromise
                    .then(() => {
                        // Video could be autoplayed
                        this.started = true;
                    })
                    .catch(() => {
                        // Video couldn't be autoplayed because of autoplay policy. Mute it and play.
                        this.videoElement.muted = true;
                        this.videoElement.play().catch(() => {
                            this.$emit('no-auto-play');
                        });
                        this.started = true;
                    });
            } else {
                requestTimeout(this.playVideo, 500);
            }
        },
        pauseVideo() {
            if (!this.started) return;
            this.started = false;

            if (!this.videoElement.paused) this.videoElement.pause();
        },
        reset() {
            this.videoElement.currentTime = 0;
        }
    }
};
</script>

<style lang="scss" scoped>
.video-wrapper {
    position: relative;
    width: 100%;
    .play-button {
        opacity: 0;
    }
    &.with-play-button {
        .play-button {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border: 0;
            opacity: 1;
            z-index: 2;
            &::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                opacity: 0.5;
                background: $black;
            }
        }
    }
}

.play-symbol {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: $gutter * 2;
    border: 2px solid $white;
    border-radius: 50%;
    z-index: 2;
    &::before,
    &::after {
        content: '';
    }
    &::before {
        display: block;
        padding-bottom: 100%;
    }
    &::after {
        position: absolute;
        top: 50%;
        left: 50%;
        border-top: $line-height * 0.75 solid transparent;
        border-left: $gutter * 0.75 solid $white;
        border-bottom: $line-height * 0.75 solid transparent;
        border-radius: 3px;
        box-sizing: border-box;
        transform: translate(-33%, -50%);
    }
}

.thumbnail {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
}

.video {
    position: relative;
    width: 100%;
    z-index: 0;
}

.start-video-leave {
    opacity: 1;
}
.start-video-leave-to {
    opacity: 0;
}
.start-video-leave-active {
    transition: transition(
        (
            opacity: (
                $short-duration
            )
        ),
        $ease-out-timing-function
    );
}

@media (min-width: $phone) {
    .play-symbol {
        width: $gutter * 3;
        &::after {
            border-top: $line-height solid transparent;
            border-left: $gutter solid $white;
            border-bottom: $line-height solid transparent;
        }
    }
}
</style>
