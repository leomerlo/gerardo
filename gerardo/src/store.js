import Vue from 'vue'
import Vuex from 'vuex'
import router from './router';
import { vuexfireMutations, firestoreAction } from 'vuexfire'
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  setPersistence,
  browserSessionPersistence
} from "firebase/auth";
import { expensesRef } from '@/db'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: localStorage.getItem('gerardo-user') || null,
    expenses: [],
  },
  mutations: {
    ...vuexfireMutations,
    setUser(state, payload) {
      state.user = payload;
      localStorage.setItem('gerardo-user', state.user.stringify);
    },
  },
  actions: {
    setExpenses: firestoreAction(
      (context) => {
        const userExpenses = expensesRef.where('uid','==',context.state.user.uid).orderBy('paid', 'asc');
        context.bindFirestoreRef('expenses', userExpenses);
      }
    ),
    addExpense: firestoreAction((context, payload) => {
      return expensesRef.add(payload)
    }),
    deleteExpense: firestoreAction((context, id) => {
      return expensesRef.doc(id).delete()
    }),
    updateExpense: firestoreAction((context, payload) => {
      return expensesRef
        .doc(payload.id)
        .set(payload)
    }),
    disableExpense: firestoreAction((context, id) => {
      return expensesRef
        .doc(id)
        .update('disabled', true)
    }), 
    enableExpense: firestoreAction((context, id) => {
      return expensesRef
        .doc(id)
        .update('disabled', false)
    }),
    unlinkExpense: firestoreAction((context, id) => {
      return expensesRef
        .doc(id)
        .update({
          'linked': null,
          'recurrentId': null
        })
    }),
    cloneExpense: firestoreAction((context, payload) => {
      const clonedExpense = {
        ...payload,
        id: null,
        recurrentId: payload.id,
        linked: true,
        recurrent: false,
      }
      return expensesRef.add(clonedExpense)
    }),
    async loginUser(context) {
      const auth = getAuth();

      setPersistence(auth, browserSessionPersistence).then(() => {
        const provider = new GoogleAuthProvider();
        return signInWithPopup(auth, provider)
        .then((result) => {
          const user = result.user;
          context.commit('setUser', user);
          router.push('/');
          // ...
        }).catch((error) => {
          
          const errorMessage = error.message;
          throw new Error(errorMessage);
        });
      })
    },
    async signOutUser(context) {
      const auth = getAuth();

      signOut(auth).then(() => {
        context.commit('setUser', null);
      }).catch((error) => {
        console.warn('Error ', error);
      });
    },
  },
  getters: {
    getUser: (state) => state.user || null,
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