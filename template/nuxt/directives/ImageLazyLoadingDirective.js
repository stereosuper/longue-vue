const loadImage = (figure, binding) => {
    const image = new Image();

    image.addEventListener(
        'load',
        () => {
            figure.insertBefore(image, figure.firstChild);
            figure.style.removeProperty('min-height');
            if (binding.value && binding.value.lazyLoaded) binding.value.lazyLoaded();
        },
        false
    );

    image.addEventListener(
        'error',
        () => {
            if (binding.value && binding.value.lazyError) {
                binding.value.lazyError();
            }
        },
        false
    );

    const { srcset, sizes, src, alt } = figure.dataset;

    image.srcset = srcset;
    image.sizes = sizes;
    image.src = src;
    image.alt = alt;
    image.classList.add('fit-image');
};

export default {
    inserted: (figure, binding) => {
        const handleIntersect = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    loadImage(figure, binding);
                    observer.unobserve(figure);
                }
            });
        };
        const createObserver = () => {
            const options = {
                root: null,
                threshold: 0
            };
            const observer = new IntersectionObserver(handleIntersect, options);
            observer.observe(figure);
        };

        if (window.IntersectionObserver) {
            createObserver();
        } else {
            loadImage(figure, binding);
        }
    }
};
