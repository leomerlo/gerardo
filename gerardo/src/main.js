import Vue from 'vue'
import { firestorePlugin } from 'vuefire'
import App from './App.vue'
import router from './router';
import store from './store';
import { BootstrapVue } from 'bootstrap-vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faTimes, faBars, faMoneyBillWave, faCog, faAngleLeft, faAngleRight, faToggleOff, faToggleOn, faPen, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false

library.add(faTimes, faBars, faMoneyBillWave, faCog, faAngleLeft, faAngleRight, faToggleOff, faToggleOn, faPen, faTrashCan)

Vue.use(BootstrapVue)
Vue.use(firestorePlugin);
Vue.component('font-awesome-icon', FontAwesomeIcon)


new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
