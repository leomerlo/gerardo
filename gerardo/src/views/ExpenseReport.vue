<template>
  <div>
    <h1>Reporte de Gastos</h1>
    <router-link
      :to="{ name: 'ExpenseReport', params: { year: year - 1 }}"
    >
      Año Anterior
    </router-link>
    <router-link
      :to="{ name: 'ExpenseReport', params: { year: new Date().getFullYear() }}"
    >
      Año Actual
    </router-link>
    <router-link
      :to="{ name: 'ExpenseReport', params: { year: year + 1 }}"
    >
      Año Siguente
    </router-link>
    <ul>
      <li
        v-for="(month, name, index) in yearlyExpenses"
        :key="index"
      >
        {{ name }}: ${{ totalExpensesByMonth(month) }}
      </li>
    </ul>
    <router-link
      :to="{ name: 'Month', params: currentDate }"
    >
      Atras
    </router-link>
  </div>
</template>

<script>
import DateHelpersMixin from '@/mixins/dateHelpers.vue';
import MonthlyExpensesMixin from '@/mixins/monthlyExpenses.vue';

export default {
  name: 'ExpenseReport',
  mixins: [
    DateHelpersMixin,
    MonthlyExpensesMixin
  ],
  computed: {
    yearlyExpenses: function() {
      let yearlyExpenses = {};
      for (let index = 0; index < 12; index++) {
        yearlyExpenses[this.humanMonth(index + 1)] = this.expenseByMonth(index + 1);
      }

      return yearlyExpenses;
    }
  },
}
</script>

<style>

</style>