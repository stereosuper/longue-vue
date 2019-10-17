<%_ if (i18n) { _%>
export const state = () => ({
    localePath: '/'
});
<%_ } else { _%>
// export const state = () => ({});
<%_ } _%>

// export const getters = () => {};

<%_ if (i18n) { _%>
export const mutations = {
    setLocalePath(state, { locale, defaultLocale }) {
        state.localePath = `${defaultLocale !== locale ? `/${locale}/` : '/'}`;
    }
};
<%_ } else { _%>
// export const mutations = {};
<%_ } _%>

// export const actions = {};
