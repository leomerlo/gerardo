<template>
  <div>
    <h1>Gerardo</h1>

    <monthly-expense
      :month="getMonth"
      :key="getMonth"
    />

    <button @click="prevMonth"> Atras </button>
    <button @click="nextMonth"> Adelante </button>

    <button @click="clearData" disabled> Limpiar Data </button>

  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import router from '../router';
import monthlyExpense from '@/components/monthlyExpense';

export default {
  name: 'MonthlyView',
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
      return parseInt(this.$route.params.month);
    }
  },
  methods: {
    nextMonth(){
      router.push({ name: 'MonthlyView', params: { month: this.getMonth + 1 }})
    },
    prevMonth(){
      router.push({ name: 'MonthlyView', params: { month: this.getMonth - 1 }})
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