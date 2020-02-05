export const state = () => ({
    loading: true,
    localePath: '/'
});

// export const getters = () => {};

export const mutations = {
    setLoading(state, loading) {
        state.loading = loading;
    },
    setLocalePath(state, { locale, defaultLocale }) {
        state.localePath = `${defaultLocale !== locale ? `/${locale}/` : '/'}`;
    }
};

// export const actions = {};
