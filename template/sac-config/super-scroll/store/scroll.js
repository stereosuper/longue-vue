export const state = () => ({
    firstScrollTop: 0,
    scrollTop: 0
});

export const mutations = {
    setFirstScrollTop(state, firstScrollTop) {
        state.firstScrollTop = firstScrollTop;
        state.scrollTop = firstScrollTop;
    },
    setScrollTop(state, scrollTop) {
        state.scrollTop = scrollTop;
    }
};
