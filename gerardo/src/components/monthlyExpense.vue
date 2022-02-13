<template>
  <div>
    <div v-if="allExpenses.length > 0">
      <h1>Hola</h1>

      <h2>Gastos recurrentes</h2>
      
      <expense-list
        :expenses="recurrentExpenses"
      />

      <h2>Viewing Month: {{ month }}</h2>

      <expense-list
        :expenses="expensesCurrentMonth"
      />

      <h2>Gasto total del mes: ARS{{ totalExpenses }} | USD{{ totalExpenses / totalExpensesConversion || 1 }}</h2>
    </div>

    <expense-form
      :expense="editingExpense"
      :month="month"
      @createdExpense="checkRecurrentExpenses"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import moment from 'moment';
import expenseList from '@/components/expenseList';
import expenseForm from '@/components/expenseForm';

export default {
  name: 'monthlyExpense',
  components: {
    expenseForm,
    expenseList
  },
  props: {
    month: {
      type: Number,
      required: true,
    }
  },
  data() {
    return {
      editingExpense: {},
      exchangeValues: null,
    }
  },
  mounted() {
    this.checkRecurrentExpenses();
    this.getExchangeValues();
  },
  computed: {
    ...mapGetters([
      'allExpenses',
      'nonRecurrentExpenses',
      'recurrentExpenses',
    ]),
    totalExpenses: function(){
      let total = 0;
      this.expensesCurrentMonth.forEach((e) => {
        if(!e.disabled) {
          total += parseInt(e.value);
        }
      });
      return total;
    },
    expensesCurrentMonth: function(){
      return this.expenseByMonth(this.month);
    },
    totalExpensesConversion: function(){
      return this.exchangeValues?.blue.value_sell;
    }
  },
  methods: {
    expenseByMonth(month) {
      return this.nonRecurrentExpenses.filter((e) => parseInt(e.month) === parseInt(month));
    },
    checkRecurrentExpenses(){
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
          this.$store.dispatch('cloneExpense', e);
        }
      })
    },
    getExchangeValues() {
      fetch('https://api.bluelytics.com.ar/v2/latest')
      .then(response => response.json())
      .then(data => this.exchangeValues = data)
    }
  },
}
</script>

<style>

</style>