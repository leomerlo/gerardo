<template>
  <div
    class="expense-list-item"
  >
    <div v-if="expense && mode === 'list'">
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <input
            class="paid-checkbox"
            type="checkbox"
            v-model="paidModel"
            v-if="expense.recurrentId || expense.month"
          />
          <span class="name">{{ expense.name }}</span>
          <span class="value">${{ expense.value }}</span>
        </div>
        <div class="d-flex gap-2 mt-2">
          <b-button v-if="expense.disabled" variant="icon" @click="enableExpense(expense)"><font-awesome-icon icon="fa-solid fa-toggle-off" /></b-button>
          <b-button v-if="!expense.disabled" variant="icon" @click="editExpense(expense)"><font-awesome-icon icon="fa-solid fa-pen" /></b-button>
          <b-button v-if="expense.recurrentId && !expense.disabled" variant="icon" @click="disableExpense(expense)"><font-awesome-icon icon="fa-solid fa-toggle-on" /></b-button>
          <b-button v-if="!expense.recurrentId" variant="icon" @click="deleteExpense(expense)"><font-awesome-icon icon="fa-solid fa-trash-can" /></b-button>
        </div>
      </div>
    </div>
    <div
      v-else
    >
      <expense-form
        :year="parseInt(expense.year)"
        :month="parseInt(expense.month)"
        :expense="expense"
        mode="edit"
        @updatedExpense="updatedExpense"
        @cancelEdit="cancelEdit"
      />
    </div>
  </div>
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
    paidModel: {
      get () { return this.expense.paid },
      set () {
        this.completeExpense()
      },
    },
  },
  methods: {
    editExpense: function (expense) {
      this.mode = "edit";
      this.$emit('editExpense', expense);
    },
    cancelEdit: function() {
      this.mode = "list";
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
    completeExpense: function(){
      const updatedExpense = {
        ...this.expense,
      };
      updatedExpense.paid = !this.expense.paid;
      this.$store.dispatch('updateExpense', updatedExpense);
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

<style lang="scss" scoped>
  .expense-list-item {
    border-bottom: 1px solid $grey-200;
    padding: 10px;

    &:last-child {
      border-bottom: none;
    }
  }

  .paid-checkbox {
    margin-right: 10px;
  }

  .name {
    display: inline-block;
    text-transform: uppercase;
  }

  .value {
    display: inline-block;
    font-weight: bold;
    margin-left: 20px;
  }
</style>