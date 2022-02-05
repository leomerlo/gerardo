import Vue from 'vue'
import { firestorePlugin } from 'vuefire'
import VueRouter from 'vue-router'
import App from './App.vue'
import router from './router';
import store from './store';

Vue.config.productionTip = false

Vue.use(firestorePlugin)
.use(VueRouter);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
