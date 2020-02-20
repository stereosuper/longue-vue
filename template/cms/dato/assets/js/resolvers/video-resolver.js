export const resolveInputData = data => {
    const { video, videoThumbnail, autoplay, loop, muted } = data;

    return {
        video: {
            url: video.url,
            dimensions: {
                width: video.width,
                height: video.height
            },
            metadata: {
                alt: video.alt,
                copyright: video.copyright
            }
        },
        thumbnail: {
            url: videoThumbnail.url,
            dimensions: {
                width: videoThumbnail.width,
                height: videoThumbnail.height
            },
            metadata: {
                alt: videoThumbnail.alt,
                copyright: videoThumbnail.copyright
            }
        },
        autoplay,
        loop,
        muted
    };
};
