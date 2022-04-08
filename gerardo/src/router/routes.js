import Month from '../views/Month.vue';
import Recurrent from '../views/Recurrent.vue';
import MonthDetailedExpenses from '../views/MonthDetailedExpenses.vue';
import ExpenseReport from '../views/ExpenseReport.vue';
import Login from '../views/Login.vue';

const routes = [
  {
    path: '/',
    name: 'MonthRedirect',
    component: Month,
    beforeEnter: function(from, to, next){
      const month = new Date().getMonth() + 1;
      const year = new Date().getFullYear();
      if(!from.params.month){
        return next({
          name: 'Month',
          params: { month, year }
        })
      }
    },
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: '/month/:year/:month',
    name: 'Month',
    component: Month,
    meta: {
      transition: 'slide-right',
      requiresAuth: true,
    },
    props: true,
    beforeEnter: function(from, to, next){
      const month = new Date().getMonth() + 1;
      const year = new Date().getFullYear();
      if(
        (typeof from.params.month !== 'number' || typeof from.params.year !== 'number')
        ||
        (from.params.month > 12 || from.params.month < 1 || from.params.year < 1)
      ){
        return next({
          name: 'Month',
          params: { month, year }
        })
      } else {
        return next();
      }
    },
  },
  {
    path: '/recurrent',
    name: 'Recurrent',
    component: Recurrent,
    meta: {
      transition: 'slide-left',
      requiresAuth: true,
    },
  },
  {
    path: '/expenses/:year/:month',
    name: 'MonthDetailedExpenses',
    component: MonthDetailedExpenses,
    meta: {
      transition: 'slide-left',
      requiresAuth: true,
    },
    props: true,
  },
  {
    path: '/expenseReport/:year',
    name: 'ExpenseReport',
    component: ExpenseReport,
    meta: {
      transition: 'slide-left',
      requiresAuth: true,
    },
    props: true,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
];

export default routes;
