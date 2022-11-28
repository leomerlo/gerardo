import HomePage from '../views/Home.vue';
import LoginPage from '../views/Login.vue';
import MonthlyView from '../views/Monthly.vue';
import RunPage from '../views/RunPage.vue';

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
    path: '/monthly/:year/:month',
    name: 'MonthlyView',
    component: MonthlyView,
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: '/login',
    name: 'LoginPage',
    component: LoginPage,
  },
  {
    path: '/run',
    name: 'RunPage',
    component: RunPage,
  },
];

export default routes;
