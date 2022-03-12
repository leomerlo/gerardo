<template>
  <div>
    <h1>Gerardo</h1>

    <monthly-expense
      :month="getMonth"
      :key="getMonth"
    />

    <button @click="prevMonth"> Atras </button>
    <button @click="nextMonth"> Adelante </button>

    <button @click="clearData"> Limpiar Data </button>

  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import moment from 'moment';
import monthlyExpense from '@/components/monthlyExpense';

export default {
  name: 'Home',
  components: {
    monthlyExpense,
  },
  data() {
    return {
      monthTracker: 0,
    }
  },
  computed: {
    ...mapGetters([
      'allExpenses',
    ]),
    getMonth() {
      return parseInt(moment(new Date).add(this.monthTracker, 'months').format('M'))
    }
  },
  methods: {
    nextMonth(){
      this.monthTracker++;
    },
    prevMonth(){
      this.monthTracker--;
    },
    clearData() {
      this.allExpenses.filter((e) => {
        if(e.recurrentId) {
          this.$store.dispatch('deleteExpense',e.id);
        }
      })
    }
  },
}
</script>

<style>

</style>