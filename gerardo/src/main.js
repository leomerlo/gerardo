import Vue from 'vue'
import { firestorePlugin } from 'vuefire'
import App from './App.vue'
import VueRouter from 'vue-router';
import router from './router';

Vue.config.productionTip = false

Vue.use(firestorePlugin)

Vue.use(VueRouter);

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
