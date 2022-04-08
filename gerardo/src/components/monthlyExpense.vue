<template>
  <div>
    <div v-if="monthlyExpenses.length > 0">
      <expense-list
        :expenses="monthlyExpenses"
        :editable="false"
      />

      <button
        @click="showFormToggle(true)"
      >
        Nuevo
      </button>
    </div>
    <div
      v-else
    >
      <h1>Todavía no tenés ninguna info cargada</h1>

      <button
        @click="showFormToggle(true)"
      >
        Nuevo
      </button>
    </div>

    <expense-form
      v-if="showForm"
      :expense="editingExpense"
      :month="month"
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
    },
    monthlyExpenses: {
      type: Array,
      required: true,
    }
  },
  data() {
    return {
      editingExpense: {},
      showForm: false,
    }
  },
  mounted() {
    this.getExchangeValues();
  },
  computed: {
    ...mapGetters([
      'nonRecurrentExpenses',
      'recurrentExpenses',
    ]),
  },
  methods: {
    checkRecurrentExpenses(){
      console.log('checkingRecurrentExpenses');
      if( this.month < parseInt(moment(new Date).format('M')) ) {
        return false;
      }
      // Validamos que los recurrent existan para el mes
      this.recurrentExpenses.forEach((e) => {
        let exists = false;
        this.monthlyExpenses.forEach((f) => {
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
      try {
        fetch('https://api.bluelytics.com.ar/v2/latest')
        .then(response => response.json())
        .then(data => this.exchangeValues = data)
      } catch(e) {
        return null;
      }
    },
    /**
     * Toggles the form on and off
     * 
     * @param value - Bool
     */
    showFormToggle(value) {
      this.showForm = value ? value : this.showForm ? false : true;
    },
  },
  watch: {
    monthlyExpenses: 'checkRecurrentExpenses',
  }
}
</script>

<style>

</style>