import Vue from 'vue'
import Vuex from 'vuex'
import { vuexfireMutations, firestoreAction } from 'vuexfire'
import { expensesCollection } from '@/db'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    expenses: []
  },
  mutations: {
    ...vuexfireMutations,
  },
  actions: {
    setExpenses: firestoreAction(
      ({ bindFirestoreRef }) => {
        bindFirestoreRef('expenses', expensesCollection)
      }
    ),
    addExpense: firestoreAction((context, payload) => {
      return expensesCollection.add(payload)
    }),
    deleteExpense: firestoreAction((context, payload) => {
      console.log(`Deleting book ${payload.expenseId}`)
      return expensesCollection.doc(payload).delete()
    }),
  },
  getters: {
    allExpenses: (state) => {
      return state.expenses;
    },
  }
});