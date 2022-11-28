<template>
  <div>
    <div
      v-if="areExpensesAvailable"
    >
      <expense-list-item
        v-for="expense in expenses"
        :key="expense.id"
        :expense="expense"
        @editExpense="editExpense"
      />
    </div>
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
  .card-group {
    gap: 10px;
  }
</style>