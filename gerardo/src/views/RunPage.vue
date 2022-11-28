<template>
  <div>
    <b-button @click="updateExpensesYear">Agregar año a las expensas</b-button>
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
    }
  }
}
</script>

<style>

</style>