<template>
  <div>
    <ul
      v-if="areExpensesAvailable"
    >
      <li
        v-for="expense in expenses"
        :key="expense.id"
      >
        <expense-list-item
          :expense="expense"
          @editExpense="editExpense"
        />
      </li>
    </ul>
    <div v-else>
      No hay gastos para este mes.
    </div>
  </div>
</template>

<script>
import expenseListItem from '@/components/expenseListItem';

export default {
  name: "expenseList",
  components: {
    expenseListItem,
  },
  props: {
    expenses: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
    }
  },
  computed: {
    areExpensesAvailable: function (){
      return this.expenses.length > 0;
    },
  },
  methods: {
    editExpense: function (expense) {
      this.$emit('editExpense', expense);
    }
  }
}
</script>

<style>

</style>