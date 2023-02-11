<template>
  <div class="spent-overview">
    <div class="monthly-overview">
      <h2>Total de gastos:</h2>
      <div class="exchange">
        <span class="pesos">{{ 'AR' + currencyFormat(totalExpenses,'ARS') }}</span>
        <span class="dollars">{{ currencyFormat(totalExpenses / totalExpensesConversion || 1) }}</span>
      </div>
    </div>
    <div class="yearly-overview">
      <h3>Gasto acumulado:</h3>
      <div class="exchange .h3">
        <span class="pesos">{{ 'AR' + currencyFormat(yearly, 'ARS') }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { currencyFormat } from '../utils/formatter';

export default {
  props: {
    expenses: {
      type: Array,
      required: true,
    },
    yearly: {
      type: Number,
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
    currencyFormat(value, currency = 'USD') {
      return currencyFormat(value, currency);
    }
  },
  mounted() {
    this.getExchangeValues();
  }
}
</script>

<style lang="scss">
  .spent-overview {
    padding: 1.8125rem;
    border-radius: 1.25rem;
    color: #FFF;
    background: linear-gradient(180deg, #4E3BBA 0%, #725FDC 100%);
  }

  @media (min-width: 768px) {
    .monthly-overview,
    .yearly-overview {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .exchange {
        font-size: 64px;

        & > span {
          display: inline-block;
          margin-bottom: .625rem;
          margin-right: 2.5rem;
        }
      }
    }

    .yearly-overview {
      .exchange {
        font-size: 3.5rem;
      }
    }
  }
</style>