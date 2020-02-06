import Vue from 'vue';
// NOTE: Here's how to import SuperComponents
<%_ if (sacConfig.superScroll) { _%>
import { useSacVue, useSuperWindowVue, useSuperScrollVue } from '@stereorepo/sac';
<%_ } else { _%>
import { useSacVue, useSuperWindowVue } from '@stereorepo/sac';
<%_ } _%>

import Icon from '~/components/Miscellaneous/Icon';

Vue.prototype.$stereosuper = {
    ...Vue.prototype.$stereosuper,
    namespace: 'stereosuper'
};

const isDevEnv = process.env.NODE_ENV !== 'production';
Vue.config.performance = isDevEnv;

// Set Vue.use here
// NOTE: Here's an example of how to use SuperComponents like SuperWindowVue
Vue.use(useSacVue);
Vue.use(useSuperWindowVue);
<%_ if (sacConfig.superScroll) { _%>
Vue.use(useSuperScrollVue);
<%_ } _%>

// Set Vue.component here
Vue.component('Icon', Icon);
