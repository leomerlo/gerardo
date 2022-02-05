<template>
  <div>
    <h1>Hola</h1>

    <h2>Gastos recurrentes</h2>
    
    <expense-list
      :expenses="recurrentExpenses"
    />

    <h2>Viewing Month: {{ month }}</h2>

    <expense-list
      :expenses="expenseByMonth(month)"
    />

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
        console.log('Recurrente', e.name, ' valor ', exists);
        console.log(this.month);
        console.log(this.expenseByMonth(this.month));
        this.expenseByMonth(this.month).forEach((f) => {
          console.log('Recurrent ', e.name);
          console.log('Monthly ', f.name);
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
    }
  },
}
</script>

<style>

</style>