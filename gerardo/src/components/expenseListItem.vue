<template>
  <div
    class="expenseData"
    v-if="expense && mode === 'list'"
  >
    <div>Nombre: {{ expense.name }}</div>
    <div>Value: {{ expense.value }}</div>
    <div
      v-if="expense.recurrentId || expense.month"
    >
      Pagado:
      <input
        type="checkbox"
        v-model="expense.paid"
        @change="completeExpense(expense)"
      />
    </div>
    <div v-if="expense.disabled">Deshabilitado</div>
    <div v-if="expense.disabled"><button @click="enableExpense(expense)">Habilitar</button></div>
    <div v-if="!expense.disabled"><button class="editExpense" @click="editExpense(expense)">Editar</button></div>
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
    disableExpense: function(expense){
      this.$store.dispatch('disableExpense', expense.id);
    },
    enableExpense: function(expense){
      this.$store.dispatch('enableExpense', expense.id);
    },
    completeExpense: function(expense){
      this.$store.dispatch('updateExpense', expense);
    },
    deleteExpense: function (expense) {
      if (!expense.recurrentId) {

        try {
          // We unlink all previous month's dependencies
          const olderDependencies = this.nonRecurrentExpenses.filter((e) => e.month <= moment(new Date).format('M'));
          olderDependencies.forEach((e) => {
            this.$store.dispatch('unlinkExpense', e.id);
          })

          // We remove all future dependencies
          const newerDependencies = this.nonRecurrentExpenses.filter((e) => e.month > moment(new Date).format('M'));
          newerDependencies.forEach((e) => {
            this.$store.dispatch('deleteExpense', e.id);
          })
        } catch (e) {
          throw new Error("There was a problem removing the linking, please try again");
        }

        // We remove the expense
        this.$store.dispatch('deleteExpense', expense.id);
      } else {
        throw new Error('You can\'t eliminate linked dependencies');
      }
    },
    updatedRecurrentDependencies(expense){
      if( !expense.recurrent ){
        return false;
      }

      try {
        const recurrentId = parseInt(expense.id);
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