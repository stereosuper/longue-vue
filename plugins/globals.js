import Vue from 'vue';

Vue.prototype.$stereosuper = {
    ...Vue.prototype.$stereosuper,
    namespace: 'stereosuper',
};

const isDevEnv = process.env.NODE_ENV !== 'production';
Vue.config.performance = isDevEnv;
