<template>
  <div>
    <h1>Gerardo</h1>

    <monthly-expense
      :month="getMonth"
      :year="getYear"
      :key="getMonth"
    />

    <button @click="() => { this.prevMonth(this.getYear, this.getMonth).bind(this) }" id="prevMonth"> Atras </button>
    <button @click="() => { this.nextMonth(this.getYear, this.getMonth).bind(this) }" id="nextMonth"> Adelante </button>

    <button @click="clearData" disabled> Limpiar Data </button>

  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import monthlyExpense from '@/components/monthlyExpense';

export default {
  name: 'MonthlyView',
  components: {
    monthlyExpense,
  },
  computed: {
    ...mapGetters([
      'allExpenses',
    ]),
    getMonth() {
      return parseInt(this.$route?.params.month);
    },
    getYear() {
      return parseInt(this.$route?.params.year);
    }
  },
  methods: {
    nextMonth(year, month){
      if(this.getMonth < 12) {
        month++;
      } else {
        year++;
        month = 1;
      }
      this.$router.push({
        name: 'MonthlyView',
        params: {
          year,
          month
        } 
      });
    },
    prevMonth(year, month){
      if(this.getMonth > 1) {
        month--;
      } else {
        year--;
        month = 12;
      }
      this.$router.push({
        name: 'MonthlyView',
        params: {
          year,
          month
        } 
      });
    },
    clearData() {
      this.allExpenses.filter((e) => {
        this.$store.dispatch('deleteExpense',e.id);
      })
    }
  },
}
</script>

<style>

</style>