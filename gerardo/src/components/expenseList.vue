<template>
  <div>
    <ul
      v-if="areExpensesAvailable"
    >
      <li
        v-for="expense in expenses"
        :key="expense.id"
      >
        <div>Nombre: {{ expense.name }}</div>
        <div>Mes: {{ expense.month }}</div>
        <div>Value: {{ expense.value }}</div>
        <div>Recurrent: {{ expense.recurrent }}</div>
        <div><button @click="deleteExpense(expense.id)">Eliminar</button></div>
      </li>
    </ul>
    <div v-else>
      No hay gastos para este mes.
    </div>
  </div>
</template>

<script>
export default {
  name: "expenseList",
  props: {
    expenses: {
      type: Array,
      required: true
    }
  },
  computed: {
    areExpensesAvailable: function(){
      return this.expenses.length > 0;
    }
  },
  methods: {
    deleteExpense: function(expenseId) {
      this.$store.dispatch('deleteExpense', expenseId);
    }
  }
}
</script>

<style>

</style>