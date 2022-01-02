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

Vue.component('Icon', Icon);
Vue.use({
  install(Vue) {
    Vue.prototype.$rokka = (key) => {
      if (key === '') {
        return null;
      }
      return rokka({
        apiKey: key,
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
  if (localStorage.getItem('rokkaOrg')) {
    title = title + ' (in ' + localStorage.getItem('rokkaOrg') + ')';
  }
  next();
  document.title = title;
});
new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
