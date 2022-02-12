import firebase from 'firebase/compat/app';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import store from '@/store';
import router from '@/router';

// Get a Firestore instance
export const db = firebase
  .initializeApp({
    apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
    authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VUE_APP_FIREBASE_ID,
  })
  .firestore()

// Export types that exists in Firestore
// This is not always necessary, but it's used in other examples
const { Timestamp } = firebase.firestore
export { Timestamp }

// if using Firebase JS SDK < 5.8.0
db.settings({ timestampsInSnapshots: true })

const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user) {
    store.commit('setUser', user);
    store.dispatch('setExpenses');
  } else {
    router.push('Login');
  }
});

export default db;

export const expensesRef = db.collection('expenses')