<template>
  <div>
    <ul
      v-if="areExpensesAvailable"
    >
      <li
        v-for="expense in expenses"
        :key="expense.id"
      >
        {{ expense.name }}
        {{ expense.value }}
        {{ expense.recurrent }}

        <button @click="deleteExpense(expense.id)">Eliminar</button>
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
  }
}
</script>

<style>

</style>