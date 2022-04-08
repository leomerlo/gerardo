<template>
  <div>
    <h1>Mis gastos recurrentes</h1>
    <expense-list
      :expenses="recurrentExpenses"
      :editable="true"
    />
    <hr />
    <button
      @click="$router.back()"
    >
      Atras
    </button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import expenseList from '@/components/expenseList';

export default {
  name: "Recurrent",
  components: {
    expenseList,
  },
  computed: {
    ...mapGetters([
      'recurrentExpenses',
    ])
  }
}
</script>

<style>

</style>