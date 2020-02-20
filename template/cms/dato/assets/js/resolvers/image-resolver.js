import { isIe11, isSafari } from '@stereorepo/sac';
import { BREAKPOINTS } from '~/plugins/breakpoints';

const imgixParameters = url =>
    `${url}?lossless=true&fm=${isSafari() || isIe11() ? url.split('.').pop() : 'webp'}&auto=format`;

export const resolveSrc = ({ data: { url } }) => imgixParameters(url);

export const resolveSrcSet = ({ data, breakpoints, isFullWidth }) => {
    let srcsetOutput = '';
    const breakpointsLength = breakpoints.length;

    let maxWidth = 0;

    // Generating srcset instructions for each breakpoint passed in args
    breakpoints.forEach((breakpoint, index) => {
        const { url } = data;
        const width = BREAKPOINTS[breakpoint];

        if (width > maxWidth) maxWidth = BREAKPOINTS[breakpoint];

        const resizeUrl = `${imgixParameters(url)}&w=${width}`;
        srcsetOutput += `${resizeUrl} ${width}w`;
        srcsetOutput += breakpointsLength - 1 === index ? '' : ', ';
    });

    // Checking if the image's full width size is bigger than the biggest breakpoint
    if (isFullWidth && data.dimensions.width > maxWidth) {
        srcsetOutput += `, ${data.url} ${data.dimensions.width}w`;
    }

    return srcsetOutput;
};

export const resolveSizes = ({ data, breakpoints, isFullWidth }) => {
    let sizesOutput = '';
    const breakpointsLength = breakpoints.length;

    let maxWidth = 0;

    // Generating sizes instructions for each breakpoint passed in args
    breakpoints.forEach((breakpoint, index) => {
        const width = BREAKPOINTS[breakpoint];
        if (width > maxWidth) maxWidth = BREAKPOINTS[breakpoint];

        sizesOutput += `(max-width: ${width}px) ${width}px`;
        sizesOutput += breakpointsLength - 1 === index ? '' : ', ';
    });

    // Checking if the image's full width size is bigger than the biggest breakpoint
    if (isFullWidth && data.dimensions.width > maxWidth) {
        sizesOutput += `, (max-width: ${data.dimensions.width}px) ${data.dimensions.width}px`;
    }
    return sizesOutput;
};

export const resolveInputData = data => {
    const { alt, copyright, height, url, width } = data;

    return {
        url,
        dimensions: {
            width,
            height
        },
        metadata: {
            alt,
            copyright
        }
    };
};
