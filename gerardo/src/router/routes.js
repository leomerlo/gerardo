import HomePage from '../views/Home.vue';
import LoginPage from '../views/Login.vue';
import Monthly from '../views/Monthly.vue';

const routes = [
  {
    path: '/',
    name: 'HomePage',
    component: HomePage,
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
    name: 'LoginPage',
    component: LoginPage,
  },
];

export default routes;
