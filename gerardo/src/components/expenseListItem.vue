<template>
  <div
    class="expenseData"
    v-if="expense && mode === 'list'"
  >
    <div>id: {{ expense.id }}</div>
    <div>Nombre: {{ expense.name }}</div>
    <div>Mes: {{ expense.month }}</div>
    <div>Value: {{ expense.value }}</div>
    <div>Recurrent: {{ expense.recurrent }}</div>
    <div>Linkeado: {{ expense.recurrentId || 'no' }}</div>
    <div v-if="expense.disabled">Deshabilitado</div>
    <div v-if="expense.disabled"><button @click="enableExpense(expense)">Habilitar</button></div>
    <div v-if="!expense.disabled"><button @click="editExpense(expense)">Editar</button></div>
    <!-- If the expense is linked, we add the disabled prop -->
    <div v-if="expense.recurrentId && !expense.disabled"><button @click="disableExpense(expense)">Deshabilitar</button></div>
    <div v-if="!expense.recurrentId"><button @click="deleteExpense(expense)">Eliminar</button></div>
    
  </div>
  <expense-form
    v-else
    :month="expense.month"
    :expense="expense"
    mode="edit"
    @updatedExpense="updatedExpense"
  />
</template>

<script>
import { mapGetters } from 'vuex';
import moment from 'moment';
import expenseForm from '@/components/expenseForm';

export default {
  name: "expenseListItem",
  components: {
    expenseForm,
  },
  props: {
    expense: {
      type: Object,
      required: true,
    }
  },
  data() {
    return {
      mode: 'list',
    }
  },
  computed: {
    ...mapGetters([
      'nonRecurrentExpenses'
    ]),
  },
  methods: {
    editExpense: function (expense) {
      this.mode = "edit";
      this.$emit('editExpense', expense);
    },
    updatedExpense: function(expense){
      this.mode = "list";
      this.updatedRecurrentDependencies(expense);
    },
    deleteExpense: function (expense) {
      // If the expense is linked, we add the disabled prop
      this.$store.dispatch('deleteExpense', expense.id);
    },
    disableExpense: function(expense){
      this.$store.dispatch('disableExpense', expense.id);
    },
    enableExpense: function(expense){
      this.$store.dispatch('enableExpense', expense.id);
    },
    updatedRecurrentDependencies(expense){
      if( !expense.recurrent ){
        return false;
      }

      try {
        const recurrentId = expense.id;
        const dependencies = this.nonRecurrentExpenses.filter((e) => e.recurrentId === recurrentId && e.month >= parseInt(moment(new Date).format('M')));
        dependencies.forEach((e) => {
          const updatedExpense = {
            ...e,
            ...{
              name: expense.name,
              value: expense.value,
            },
            id: e.id
          }
          this.$store.dispatch('updateExpense', updatedExpense)
        })
      } catch(e) {
        throw new Error('There was an issue updating the expense dependencies', e);
      }
    },
  },
}
</script>

<style>

</style>