import Vue from 'vue';
import fastdom from 'fastdom';
import fastdomPromised from 'fastdom/extensions/fastdom-promised';
const fast = fastdom.extend(fastdomPromised);

Vue.prototype.$stereosuper.fastdom = fast;
