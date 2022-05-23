import Vue from 'vue';
import App from './App.vue';
import Icon from './components/common/Icon';

import '@liip/styleguide/dist/common.css';
import router from './router';
import VModal from 'vue-js-modal';
import rokka from 'rokka';
import VueClipboard from 'vue-clipboard2';
import Toast from 'vue-toastification';
// Import the CSS or use your own!
import 'vue-toastification/dist/index.css';
import rokkaHelper from './rokkaHelper';

export const ROKKA_TOKEN = 'rokka-dashboard-token';
export const ROKKA_ORG = 'rokka-dashboard-org';
const ROKKA_DASHBOARD_IPS = 'rokka-dashboard-ips';

Vue.use(Toast, {
  position: 'top-right',
  timeout: 3000,
});

Vue.use(VueClipboard);
Vue.use(VModal, {
  dynamic: true,
  injectModalsContainer: true,
  dynamicDefaults: { clickToClose: false },
});
Vue.config.productionTip = false;

export const apiTokenSetCallback = (token, payload) => {
  if (token) {
    localStorage.setItem(ROKKA_TOKEN, token);
    if (payload && payload.ips) {
      // store the ips and remember the last 8 (max is 10 on the API side)
      localStorage.setItem(
        ROKKA_DASHBOARD_IPS,
        payload.ips.slice(0, 8).join(',')
      );
    }
  } else {
    localStorage.removeItem(ROKKA_TOKEN);
  }
};
const max_age = 3600 * 24 * 7;

Vue.component('Icon', Icon);
Vue.use({
  install(Vue) {
    Vue.prototype.$rokka = (key) => {
      /*if (key === '') {
        return null;
      }*/
      return rokka({
        apiKey: key,
        apiTokenGetCallback: () => localStorage.getItem(ROKKA_TOKEN),
        apiTokenSetCallback: apiTokenSetCallback,
        apiTokenRefreshTime: max_age - 3600 * 24,
        apiTokenOptions: {
          //no_ip_protection: true, // not sure about this
          expires_in: max_age,
          renewable: true,
          ips: `request_ip,${localStorage.getItem(ROKKA_DASHBOARD_IPS) || ''}`,
        },
        // apiHost: 'http://api.rokka.test/app_dev.php',
      });
    };
    Vue.prototype.$rokkaRenderUrl = (
      image,
      rokkaOrg,
      width,
      height = null,
      format = null,
      stack = 'dynamic/resize-width-${width}-height-${height}-upscale-false-sharpen-true'
    ) => {
      return rokkaHelper.renderUrl(
        image,
        rokkaOrg,
        width,
        height,
        format,
        stack
      );
    };
  },
});

router.beforeEach((to, from, next) => {
  let title = 'Rokka Gallery · ';
  if (to.params.category) {
    title = title + ' ·  ' + to.params.category;
  } else if (to.params.search) {
    title = title + ' ·  ' + to.params.search;
  }
  if (localStorage.getItem(ROKKA_ORG)) {
    title = title + ' (in ' + localStorage.getItem(ROKKA_ORG) + ')';
  }
  next();
  document.title = title;
});
new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
