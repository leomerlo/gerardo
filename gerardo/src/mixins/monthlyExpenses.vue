<script>
import { mapGetters } from 'vuex';

export default {
  name: 'MontlyExpensesMixin',
  computed: {
     ...mapGetters([
      'nonRecurrentExpenses',
      'recurrentExpenses',
    ]),
    expensesCurrentMonth: function(){
      return this.expenseByMonth(this.month);
    },
    totalExpenses: function(){
      return this.totalExpensesByMonth(this.expensesCurrentMonth);
    },
  },
  methods: {
    expenseByMonth(month) {
      return this.nonRecurrentExpenses.filter((e) => parseInt(e.month) === parseInt(month));
    },
    totalExpensesByMonth: function(expenses){
      let total = 0;
      expenses.forEach((e) => {
        if(!e.disabled) {
          total += parseInt(e.value);
        }
      });
      return total;
    },
  }
}
</script>