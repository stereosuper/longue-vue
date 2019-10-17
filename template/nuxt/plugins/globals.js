import Vue from 'vue';
<%_ if (stereorepoSac) { _%>
// NOTE: Uncomment this line to import superComponents
// import { useSacVue, superWindowVue } from '@stereorepo/sac';
<%_ } _%>

Vue.prototype.$stereosuper = {
    ...Vue.prototype.$stereosuper,
    namespace: 'stereosuper'
};

const isDevEnv = process.env.NODE_ENV !== 'production';
Vue.config.performance = isDevEnv;

// Set Vue.use here
<%_ if (stereorepoSac) { _%>
// NOTE: Uncomment these lines to use superComponents like superWindowVue
// Vue.use(useSacVue);
// Vue.use(superWindowVue);
<%_ } _%>

// Set Vue.component here
