<template>
  <form
      @submit.prevent="addExpense"
    >
      <div
        class="formStatus"
        v-if="formError.error"
      >
        {{ formError.message }}
      </div>
      <div>
        <label for="name">Nombre:</label>
        <input
          type="text"
          name="name"
          id="name"
          v-model="newExpense.name"
          required
        />
      </div>
      <div>
        <label for="value">Valor:</label>
        <input
          type="number"
          name="value"
          id="value"
          v-model="newExpense.value"
          required
        />
      </div>
      <div>
        <label for="month">Mes:</label>
        <input
          type="number"
          name="month"
          id="month"
          v-model="newExpense.month"
          required
          max="12"
          min="1"
        />
      </div>
      <div>
        <label for="recurrent">Es gasto recurrente?</label>
        <input
          type="checkbox"
          name="recurrent"
          id="recurrent"
          v-model="newExpense.recurrent"
        />
      </div>
      <div>
        <button type="submit">Enviar</button>
      </div>
    </form>
</template>

<script>
export default {
  name: "expenseForm",
  data() {
    return {
      formError: {
        error: false,
        message: '',
      },
      newExpense: {
        name: null,
        value: null,
        month: null,
        recurrent: null,
      }
    }
  },
  methods: {
    addExpense: function(){
      if (this.newExpense.name === '' || this.newExpense.value === '' || this.newExpense.month === '') {
        this.formError.error = true;
        this.formError.message = 'Hay campos requeridos vacios'
        return false;
      }

      if (this.newExpense.month > 12 || this.newExpense.month < 1) {
        this.formError.error = true;
        this.formError.message = 'El mes está fuera de rango'
        return false;
      }

      this.$store.dispatch('addExpense', this.newExpense);
    },
    deleteExpense: function(expenseId) {
      this.$store.dispatch('deleteExpense', expenseId);
    }
  }
}
</script>

<style>

</style>