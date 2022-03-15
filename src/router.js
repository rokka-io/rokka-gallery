import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('./views/ImagesList.vue'),
    },
    {
      path: '/_/:search',
      name: 'search',
      component: () => import('./views/ImagesList.vue'),
    },
    {
      path: '/:category+',
      name: 'category',
      component: () => import('./views/Category.vue'),
    },
  ],
});
