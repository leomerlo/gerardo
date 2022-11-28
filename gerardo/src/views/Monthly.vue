<template>
  <div>

    <h1>Hola, name esto es {{ this.getMonthName }}</h1>

    <monthly-expense
      :month="getMonth"
      :year="getYear"
      :key="getMonth"
    />

    <div class="d-flex justify-content-between mt-4">

      <b-button variant="primary" @click="() => { this.prevMonth(this.getYear, this.getMonth).bind(this) }" id="prevMonth"><font-awesome-icon icon="fa-solid fa-angle-left" /> Mes anterior </b-button>
      <b-button variant="primary" @click="() => { this.nextMonth(this.getYear, this.getMonth).bind(this) }" id="nextMonth">Mes siguiente <font-awesome-icon icon="fa-solid fa-angle-right" /></b-button>

    </div>

    <!-- <button @click="clearData"> Limpiar Data </button> -->

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
    },
    getMonthName() {
      let name = '';
      switch(this.getMonth) {
        case 1:
          name = 'Enero';
          break;
        
        case 2:
          name = 'Febrero';
          break;

        case 3:
          name = 'Marzo';
          break;
      
        case 4:
          name = 'Abril';
          break;

        case 5:
          name = 'Mayo';
          break;

        case 6:
          name = 'Junio';
          break;

        case 7:
          name = 'Julio';
          break;

        case 8:
          name = 'Agosto';
          break;

        case 9:
          name = 'Septiembre';
          break;

        case 10:
          name = 'Octubre';
          break;

        case 11:
          name = 'Noviembre';
          break;

        case 12:
          name = 'Diciembre';
          break;
      }

      return name;
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