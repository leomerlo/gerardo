import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './routes';
import store from '@/store';

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (store.getters.getUser) {
      next()
      return
    } else {
      next('/login').catch(()=>{});
    }
  } else {
    next()
  }
})

export default router;