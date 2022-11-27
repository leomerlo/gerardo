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
          v-model="expenseMonth"
          required
          max="12"
          min="1"
        />
      </div>
      <div v-if="!expenseData.recurrent">
        <label for="month">Año:</label>
        <input
          type="number"
          name="year"
          id="year"
          v-model="expenseYear"
          required
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
        year: null,
        month: null,
        recurrent: false,
        uid: false,
        paid: false,
      }
    }
  },
  props: {
    year: {
      type: Number,
    },
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
    this.resetForm();
  },
  computed: {
    ...mapGetters([
      'getUser'
    ]),
    isEditMode: function() {
      return this.mode === 'edit';
    },
    expenseMonth: {
      get () {
        const d = new Date();
        return this.expenseData.month || d.getMonth() + 1;
      },
      set (value) {
        this.expenseData.month = value;
      },
    },
    expenseYear: {
      get () {
        const d = new Date();
        return this.expenseData.year || d.getFullYear();
      },
      set (value) {
        this.expenseData.year = value;
      },
    }
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
      this.formError = {
        error: false,
        message: null,
      };

      if (this.isEmpty(this.expenseData.name) || this.isEmpty(this.expenseData.value) || this.isEmpty(this.expenseData.month)) {
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
        this.resetForm();
        this.$emit('createdExpense');
      });
    },
    isEmpty(value) {
      return value === '' || value === null;
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
    resetForm: function() {
      this.expenseData.id = null;
      this.expenseData.name = null;
      this.expenseData.value = null;
      this.expenseData.year = this.expenseYear;
      this.expenseData.month = this.expenseMonth;
      this.expenseData.recurrent = false;
      this.expenseData.uid = false;
      this.expenseData.paid = false;     
    }
  },
}
</script>

<style>

</style>