const loadImage = (video, binding) => {
    const { src } = video.dataset;

    if (binding.value && binding.value.lazyLoaded) binding.value.lazyLoaded();
    video.preload = true;
    video.src = src;
};

export default {
    inserted: (video, binding) => {
        const handleIntersect = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    loadImage(video, binding);
                    observer.unobserve(video);
                }
            });
        };
        const createObserver = () => {
            const options = {
                root: null,
                threshold: 0
            };
            const observer = new IntersectionObserver(handleIntersect, options);
            observer.observe(video);
        };

        if (window.IntersectionObserver) {
            createObserver();
        } else {
            loadImage(video, binding);
        }
    }
};
