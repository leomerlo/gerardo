<template>
  <ul>
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
}
</script>

<style>

</style>