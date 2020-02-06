import Vue from 'vue';

export const BREAKPOINTS = {
    xs: 400,
    s: 580,
    m: 768,
    l: 960,
    xl: 1100,
    xxl: 1280,
    threexl: 1400
};

const init = function({ list = BREAKPOINTS, defaultBreakpoint = 'xxl' } = {}) {
    Vue.prototype.$breakpoints = {
        list,
        defaultBreakpoint: list[defaultBreakpoint]
    };
    return Vue.prototype.$breakpoints.defaultBreakpoint;
};

const defaultBreakpoint = init();

export { defaultBreakpoint };
