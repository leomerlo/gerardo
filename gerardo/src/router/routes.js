import Home from '../views/Home.vue';
import Monthly from '../views/Monthly.vue';
import Login from '../views/Login.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: '/month/:month',
    name: 'Monthly',
    component: Monthly,
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
];

export default routes;
