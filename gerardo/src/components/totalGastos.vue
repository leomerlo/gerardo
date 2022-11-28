<template>
  <div class="monthly-overview">
    <h2>Total de gastos:</h2>
    <div class="monthly-exchange">
      <span class="pesos">{{ totalExpenses }}<span class="exchange">ARS</span></span>
      <span class="dollars">{{ totalExpenses / totalExpensesConversion || 1 }}<span class="exchange">USD</span></span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    expenses: {
      type: Array,
      required: true,
    }
  },
  data() {
    return {
      exchangeValues: null,
    }
  },
  computed: {
    totalExpenses: function(){
      let total = 0;
      this.expenses.forEach((e) => {
        if(!e.disabled) {
          total += parseInt(e.value);
        }
      });
      return total;
    },
    totalExpensesConversion: function(){
      return this.exchangeValues?.blue.value_sell;
    }
  },
  methods: {
    getExchangeValues() {
      try {
        fetch('https://api.bluelytics.com.ar/v2/latest')
        .then(response => response.json())
        .then(data => this.exchangeValues = data)
      } catch(e) {
        return null;
      }
    },
  },
  mounted() {
    this.getExchangeValues();
  }
}
</script>

<style lang="scss">
  .monthly-overview {
    padding: 29px;
    border-radius: 20px;
    color: #FFF;
    background: linear-gradient(180deg, #4E3BBA 0%, #725FDC 100%);
  }

  @media (min-width: 768px) {
    .monthly-overview {
      display: flex;
      justify-content: space-around;
      align-items: center;

      .monthly-exchange {
        font-size: 64px;

        & > span {
          display: inline-block;
          margin-bottom: 10px;
          margin-right: 40px;
        }

        .exchange {
          font-size: 16px;
        }
      }
    }
  }
</style>