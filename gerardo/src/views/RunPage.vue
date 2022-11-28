<template>
  <div>
    <b-button @click="updateExpensesYear">Agregar año a las expensas</b-button>
    <b-button @click="updateExpensesPaid">Agregar paid a las expensas</b-button>
    <b-button @click="removeMonthlyExpenses">Remover expenses del mes</b-button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  computed: {
    ...mapGetters([
      'allExpenses',
      'nonRecurrentExpenses'
    ]),
  },
  methods: {
    updateExpensesYear() {
      console.log(this.allExpenses);
      this.allExpenses.filter(async (e) => {
        console.log(e);
        const expense = {
          ...e
        };
        expense.year = 2022;
        await this.$store.dispatch('updateExpense', expense);
        console.log(`Expense ${expense.name}, ${expense.id} updated`);
      })
    },
    updateExpensesPaid() {
      this.allExpenses.filter(async (e) => {
        const expense = {
          ...e
        };
        expense.paid = false;
        await this.$store.dispatch('updateExpense', expense);
        console.log(`Expense ${expense.name}, ${expense.id} updated`);
      })
    },
    removeMonthlyExpenses() {
      const month = prompt('Mes?');
      const year = prompt('Year?');
      console.log(this.expenseByMonth(month, year));
    }
  }
}
</script>

<style>

</style>