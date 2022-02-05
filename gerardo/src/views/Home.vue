<template>
  <div>
    <h1>Hola</h1>
    
    <expense-list
      :expenses="allExpenses"
    />
    
    <h2>Current Months</h2>

    <expense-list
      :expenses="expenseByMonth(currentMonth)"
    />

    <h2>Next Months: {{ getMonth }}</h2>

    <expense-list
      :expenses="expenseByMonth(getMonth)"
    />

    <button @click="prevMonth"> Atras </button>
    <button @click="nextMonth"> Adelante </button>

    <expense-form />
    
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import moment from 'moment';
import expenseList from '@/components/expenseList';
import expenseForm from '@/components/expenseForm';

export default {
  name: 'Home',
  data() {
    return {
      monthTracker: 0,
    }
  },
  components: {
    expenseForm,
    expenseList
  },
  computed: {
    ...mapGetters([
      'allExpenses'
    ]),
    currentMonth() {
      return moment(new Date).format('M');
    },
    getMonth() {
      return moment(new Date).add(this.monthTracker, 'months').format('M')
    }
  },
  methods: {
    expenseByMonth(month) {
      return this.allExpenses.filter((e) => e.month === parseInt(month));
    },
    nextMonth(){
      this.monthTracker++;
    },
    prevMonth(){
      this.monthTracker--;
    }
  }
}
</script>

<style>

</style>