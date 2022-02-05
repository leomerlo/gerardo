<template>
  <div>
    <h1>Hola</h1>

    <h2>Gastos recurrentes</h2>
    
    <expense-list
      :expenses="recurrentExpenses"
    />

    <h2>Viewing Month: {{ month }}</h2>

    <expense-list
      :expenses="thisMonthsExpenses"
    />

    <h2>Gasto total del mes: {{ totalExpenses }}</h2>

    <expense-form
      @created-expense="checkRecurrentExpenses()"
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
  mounted() {
    this.checkRecurrentExpenses();
  },
  computed: {
    ...mapGetters([
      'allExpenses',
      'nonRecurrentExpenses',
      'recurrentExpenses',
    ]),
    totalExpenses: function() {
      let total = 0;
      this.thisMonthsExpenses.forEach((e) => {
        total += parseInt(e.value);
      });
      return total;
    },
    thisMonthsExpenses: function(){
      return this.expenseByMonth(this.month);
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
        this.thisMonthsExpenses.forEach((f) => {
          if (f.name === e.name) {
            exists = true;
          }
        })
        if (!exists) {
          // Si no existen los creamos
          console.log(e.name, ' creado');
          // Convertimos el gasto en local
          const expense = {
            name: e.name,
            value: e.value,
            recurrent: false,
            month: parseInt(this.month),
          } 
          this.$store.dispatch('addExpense', expense);
        }
      })
    },
  },
}
</script>

<style>

</style>