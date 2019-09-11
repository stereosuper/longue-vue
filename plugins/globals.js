import Vue from 'vue';

Vue.prototype.$stereosuper = {
    ...Vue.prototype.$stereosuper,
    namespace: 'stereosuper',
};

const isDev = process.env.NODE_ENV !== 'production';
Vue.config.performance = isDev;
