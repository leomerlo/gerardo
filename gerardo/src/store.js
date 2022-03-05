import Vue from 'vue'
import Vuex from 'vuex'
import moment from 'moment'
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
    deleteExpense: firestoreAction((context, id) => {
      return expensesCollection.doc(id).delete()
    }),
    updateExpense: firestoreAction((context, payload) => {
      return expensesCollection
        .doc(payload.id)
        .set(payload)
    }),
    disableExpense: firestoreAction((context, id) => {
      return expensesCollection
        .doc(id)
        .update('disabled', true)
    }), 
    enableExpense: firestoreAction((context, id) => {
      return expensesCollection
        .doc(id)
        .update('disabled', false)
    }),
    cloneExpense: firestoreAction((context, payload) => {
      const clonedExpense = {
        ...payload,
        id: null,
        recurrentId: payload.id,
        linked: true,
        recurrent: false,
        month: parseInt(moment(new Date).format('M'))
      }
      return expensesCollection.add(clonedExpense)
    }),
  },
  getters: {
    allExpenses: (state) => {
      return state.expenses;
    },
    recurrentExpenses: (state) => {
      return state.expenses.filter((e) => e.recurrent);
    },
    nonRecurrentExpenses: (state) => {
      return state.expenses.filter((e) => !e.recurrent);
    }
  }
});