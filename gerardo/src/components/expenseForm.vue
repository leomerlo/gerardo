<template>
  <form
      @submit.prevent="submitExpense"
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
          v-model="expenseData.name"
          :disabled="expenseData.recurrentId"
          required
        />
      </div>
      <div>
        <label for="value">Valor:</label>
        <input
          type="number"
          name="value"
          id="value"
          v-model="expenseData.value"
          required
        />
      </div>
      <div>
        <label for="recurrent">Es gasto recurrente?</label>
        <input
          type="checkbox"
          name="recurrent"
          id="recurrent"
          v-model="expenseData.recurrent"
        />
      </div>
      <div v-if="!expenseData.recurrent">
        <label for="month">Mes:</label>
        <input
          type="number"
          name="month"
          id="month"
          v-model="expenseData.month"
          required
          max="12"
          min="1"
        />
      </div>
      <div
        v-if="expenseData.disabled"
      >
        <label for="disabled">Deshabilitado</label>
        <input
          type="checkbox"
          name="disabled"
          id="disabled"
          v-model="expenseData.disabled"
        />
      </div>
      <div>
        <button type="submit">Enviar</button>
      </div>
    </form>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: "expenseForm",
  data() {
    return {
      formError: {
        error: false,
        message: '',
      },
      expenseData: {
        id: null,
        name: null,
        value: null,
        month: null,
        recurrent: false,
        uid: false,
      }
    }
  },
  props: {
    month: {
      type: Number,
    },
    expense: {
      type: Object
    },
    mode: {
      type: String,
      default: 'add'
    }
  },
  mounted() {
    this.setEditMode();
  },
  computed: {
    ...mapGetters([
      'getUser'
    ]),
    isEditMode: function() {
      return this.mode === 'edit';
    },
  },
  methods: {
    submitExpense: function(){
      if(this.isEditMode) {
        this.updateExpense();
      } else {
        this.addExpense();
      }
    },
    addExpense: function(){
      if (this.expenseData.name === '' || this.expenseData.value === '' || this.expenseData.month === '') {
        this.formError.error = true;
        this.formError.message = 'Hay campos requeridos vacios'
        return false;
      }

      if (!this.expenseData.recurrent && (this.expenseData.month > 12 || this.expenseData.month < 1)) {
        this.formError.error = true;
        this.formError.message = 'El mes está fuera de rango'
        return false;
      }

      // Los gastos recurrentes no tienen mes asociado
      if (this.expenseData.recurrent) {
        this.expenseData.month = null;
      }

      // We add the user ID
      this.expenseData.uid = this.getUser.uid;

      this.$store.dispatch('addExpense', this.expenseData).then(() => {
        this.$emit('createdExpense');
      });
    },
    updateExpense: function(){
      // If we edit an expense coming from a recurrent, we un-link them
      if (this.expenseData.recurrentId) {
        this.expenseData.linked = null;
      }

      this.$store.dispatch('updateExpense', this.expenseData);
      this.$emit('updatedExpense', this.expenseData);
    },
    setEditMode: function(){
      if (this.isEditMode) {
        this.expenseData = {
          ...this.expense,
          id: this.expense.id
        }
      }
    },
  },
}
</script>

<style>

</style>