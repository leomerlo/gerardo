<template>
  <b-form
    @submit.prevent="submitExpense"
    >
      <div
        class="formStatus"
        v-if="formError.error"
      >
        {{ formError.message }}
      </div>
      <b-alert variant="warning" v-if="expenseData.linked" show>Este gasto está linkeado con un gasto recurrente, al hacer cambios se desvincularán. Para editar y continuar vinculados, editá el gasto recurrente.</b-alert>
      <b-form-group
        :id="`input-group-${expenseData.id}-name-group`"
        label="Nombre:"
        :label-for="`input-group-${expenseData.id}-name`"
      >
        <b-form-input
          type="text"
          name="name"
          :id="`input-group-${expenseData.id}-name`"
          v-model="expenseData.name"
          :disabled="expenseData.linked"
          required
        ></b-form-input>
      </b-form-group>
      <b-form-group
        :id="`input-group-${expenseData.id}-value-group`"
        label="Valor:"
        :label-for="`input-group-${expenseData.id}-value`"
      >
        <b-form-input
          type="number"
          name="value"
          :id="`input-group-${expenseData.id}-value`"
          v-model="expenseData.value"
          required
        ></b-form-input>
      </b-form-group>
      <b-form-group
        :id="`input-group-${expenseData.id}-recurrent-group`"
        label="Es gasto recurrente?"
        :label-for="`input-group-${expenseData.id}-recurrent`"
      >
        <b-form-checkbox
          name="recurrent"
          :id="`input-group-${expenseData.id}-recurrent`"
          v-model="expenseData.recurrent"
          :disabled="expenseData.linked"
        ></b-form-checkbox>
      </b-form-group>
      <b-form-group
        :id="`input-group-${expenseData.id}-month-group`"
        label="Mes:"
        :label-for="`input-group-${expenseData.id}-month`"
        v-if="!expenseData.recurrent"
      >
        <b-form-input
          type="number"
          name="month"
          :id="`input-group-${expenseData.id}-month`"
          v-model="expenseMonth"
          required
          max="12"
          min="1"
        ></b-form-input>
      </b-form-group>
      <b-form-group
        :id="`input-group-${expenseData.id}-year-group`"
        label="Año:"
        :label-for="`input-group-${expenseData.id}-year`"
        v-if="!expenseData.recurrent"
      >
        <b-form-input
          type="number"
          name="year"
          :id="`input-group-${expenseData.id}-year`"
          v-model="expenseYear"
          required
          max="12"
          min="1"
        ></b-form-input>
      </b-form-group>
      <b-form-group
        :id="`input-group-${expenseData.id}-disabled-group`"
        label="Deshabilitado:"
        :label-for="`input-group-${expenseData.id}-disabled`"
      >
        <b-form-checkbox
          name="disabled"
          :id="`input-group-${expenseData.id}-disabled`"
          v-model="expenseData.disabled"
        ></b-form-checkbox>
      </b-form-group>
      <div class="d-flex gap-2 mt-4">
        <b-button variant="primary" type="submit">Guardar</b-button>
        <b-button variant="light" @click="cancelEdit">Cancelar</b-button>
      </div>
    </b-form>
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
        this.expenseData.name = this.expense.name;
        this.expenseData.value = this.expense.value;
        this.expenseData.year = this.expenseYear;
        this.expenseData.month = this.expenseMonth;
        this.expenseData.recurrentId = this.expense.recurrentId;
        this.expenseData.recurrent = this.expense.recurrent;
        this.expenseData.uid = this.expense.uid;
        this.expenseData.linked = this.expense.linked;
        this.expenseData.paid = this.expense.paid;
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
    },
    cancelEdit: function() {
      this.resetForm();
      this.$emit('cancelEdit');
    }
  },
}
</script>

<style>

</style>