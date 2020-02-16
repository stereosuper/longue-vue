// 🚦Routing constants
export const routes = {
    dynamicListPage: {
        i18nFormat: 'dynamic/index',
        routerFormat: 'dynamic'
    },
    dynamicSinglePage: {
        i18nFormat: 'dynamic/_dynamic',
        routerFormat: 'dynamic-dynamic'
    }
};

export const routeByApiModels = {
    dynamics_list_page: routes.dynamicListPage,
    dynamic_page: routes.dynamicSinglePage
};
