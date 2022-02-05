<template>
  <div>
    <h1>Hola</h1>
    
    <expense-list
      :expenses="allExpenses"
    />

    <expense-form />
    
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import expenseList from '@/components/expenseList';
import expenseForm from '@/components/expenseForm';

export default {
  name: 'Home',
  components: {
    expenseForm,
    expenseList
  },
  computed: {
    ...mapGetters([
      'allExpenses'
    ])
  },
}
</script>

<style>

</style>