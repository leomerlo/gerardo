<template>
  <div>
    <h1>Gastos de {{ currentHumanMonth }}</h1>
    <month-navigator
      :month="month"
      :year="year"
    />
    <expense-list
      :expenses="expensesCurrentMonth"
      :editable="true"
    />
    <hr />
    <router-link
      :to="{ name: 'Month' }"
    >
      Atras
    </router-link>
  </div>
</template>

<script>
import ExpenseList from '@/components/expenseList';
import MonthNavigator from '@/components/monthNavigator.vue';
import MonthlyExpensesMixin from '@/mixins/monthlyExpenses.vue';
import DateHelpersMixin from '@/mixins/dateHelpers.vue';

export default {
  name: "MonthDetailedExpenses",
  components: {
    ExpenseList,
    MonthNavigator
  },
  mixins: [
    MonthlyExpensesMixin,
    DateHelpersMixin
  ],
}
</script>

<style>

</style>