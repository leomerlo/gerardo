<template>
  <div>
    <h1>Hola ${Usuario}</h1>
    <h2>Esto es {{ currentHumanMonth }}</h2>
    <h3>Total de gastos: ARS{{ totalExpenses }} | USD{{ totalExpenses / totalExpensesConversion || 1 }}</h3>

    <h4>Tus ultimos gastos</h4>
    <monthly-expense
      :month="parsedMonth"
      :monthlyExpenses="lastExpensesCurrentMonth"
    />
    <router-link
      :to="{ name: 'MonthDetailedExpenses', params: { month, year } }"
    >
      Todos los gastos
    </router-link>
    <hr />
    <router-link
      :to="{ name: 'Recurrent' }"
    >
      Gastos Recurrentes
    </router-link>
    <hr />
    <router-link
      :to="{ name: 'ExpenseReport', params: { year } }"
    >
      Reporte de gastos
    </router-link>
    <hr />
    <month-navigator
      :month="parsedMonth"
      :year="parsedYear"
    />
  </div>
</template>

<script>
import MonthlyExpense from '@/components/monthlyExpense.vue';
import MonthNavigator from '@/components/monthNavigator.vue';
import MonthlyExpensesMixin from '@/mixins/monthlyExpenses.vue';
import DateHelpersMixin from '@/mixins/dateHelpers.vue';

export default {
  name: "Month",
  components: {
    MonthlyExpense,
    MonthNavigator,
  },
  data: () => {
    return {
      exchangeValues: null,
    }
  },
  mixins: [
    MonthlyExpensesMixin,
    DateHelpersMixin,
  ],
  mounted() {
    if(!this.month) {
      this.goToCurrentMonth(this.$route.name);
    }
    this.getExchangeValues();
  },
  methods: {
    getExchangeValues() {
      try {
        fetch('https://api.bluelytics.com.ar/v2/latest')
        .then(response => response.json())
        .then(data => this.exchangeValues = data)
      } catch(e) {
        return null;
      }
    },
    goToCurrentMonth() {
      this.$router.push({ name: 'month', params: this.currentDate });
    },
  },
  computed: {
    lastExpensesCurrentMonth: function(){
      return this.expensesCurrentMonth.slice(0,4);
    },
    totalExpensesConversion: function(){
      return this.exchangeValues?.blue.value_sell;
    },
  }
}
</script>

<style>

</style>