<template>
  <div v-if="allExpenses.length > 0">

    <total-gastos :expenses="expensesCurrentMonth"/>

    <div class="monthly-expenses">

      <h2>Tus gastos del mes</h2>

      <expense-list
        :expenses="expensesCurrentMonth"
      />
    </div>

    <div class="d-flex gap-2 mt-4 mb-4">
      <b-button @click="toggleRecurrent" class="mt-4 mb-4">
        <span v-if="visibleRecurrent">Esconder recurrentes</span>
        <span v-else>Mostrar recurrentes</span>
      </b-button>

      <b-button @click="toggleNewForm" class="mt-4 mb-4">
        Agregar nuevo gasto
      </b-button>
    </div>

    <b-collapse id="add-expense" class="mt-2" :visible="newForm">
      <div class="monthly-expenses">
        <h3>Agregar nuego gasto</h3>
        <expense-form
          :year="year"
          :month="month"
          @cancelEdit="toggleNewForm"
        />
      </div>
    </b-collapse>

    <div class="monthly-expenses" v-if="visibleRecurrent">
      <h2>Gastos recurrentes</h2> 
      <expense-list
        :expenses="recurrentExpenses"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import moment from 'moment';
import expenseList from '@/components/expenseList';
import expenseForm from '@/components/expenseForm';
import totalGastos from '@/components/totalGastos.vue';

export default {
  name: 'monthlyExpense',
  components: {
    expenseList,
    totalGastos,
    expenseForm
  },
  props: {
    month: {
      type: Number,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    }
  },
  data() {
    return {
      editingExpense: {},
      visibleRecurrent: false,
      newForm: false,
    }
  },
  mounted() {
    this.checkRecurrentExpenses();
  },
  computed: {
    ...mapGetters([
      'allExpenses',
      'nonRecurrentExpenses',
      'recurrentExpenses',
    ]),
    expensesCurrentMonth: function(){
      return this.expenseByMonth(this.month, this.year);
    },
  },
  methods: {
    expenseByMonth(month, year) {
      return this.nonRecurrentExpenses.filter((e) => ((parseInt(e.month) === parseInt(month)) && (parseInt(e.year) === parseInt(year))));
    },
    checkRecurrentExpenses(){
      console.log('all: ', this.allExpenses);
      console.log('recurrent: ',this.recurrentExpenses);
      if( this.month < parseInt(moment(new Date).format('M')) ) {
        return false;
      }
      // Validamos que los recurrent existan para el mes
      this.recurrentExpenses.forEach((e) => {
        let exists = false;
        this.expensesCurrentMonth.forEach((f) => {
          if (f.name === e.name) {
            exists = true;
          }
        })
        if (!exists) { 
          e.month = this.month;
          e.year = this.year;
          this.$store.dispatch('cloneExpense', e);
        }
      })
    },
    toggleRecurrent() {
      this.visibleRecurrent = !this.visibleRecurrent;
    },
    toggleNewForm() {
      this.newForm = !this.newForm;
    }
  },
}
</script>

<style lang="scss">
  .monthly-expenses {
    margin: 10px 0;
    padding: 20px;
    border-radius: 20px;
    border: 1px solid $grey-300;
  }
</style>