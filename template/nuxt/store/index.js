<%_ if (i18n) { _%>
export const state = () => ({
    loading: true,
    localePath: '/'
});
<%_ } else { _%>
export const state = () => ({
    loading: true,
});
<%_ } _%>

// export const getters = () => {};

<%_ if (i18n) { _%>
export const mutations = {
    setLoading(state, loading) {
        state.loading = loading;
    },
    setLocalePath(state, { locale, defaultLocale }) {
        state.localePath = `${defaultLocale !== locale ? `/${locale}/` : '/'}`;
    }
};
<%_ } else { _%>
export const mutations = {
    setLoading(state, loading) {
        state.loading = loading;
    },
};
<%_ } _%>

// export const actions = {};
