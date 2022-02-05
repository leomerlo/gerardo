import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// Get a Firestore instance
export const db = firebase
  .initializeApp({
    projectId: "gerardo-1f6ae",
  })
  .firestore()

// Export types that exists in Firestore
// This is not always necessary, but it's used in other examples
const { Timestamp } = firebase.firestore
export { Timestamp }

// if using Firebase JS SDK < 5.8.0
db.settings({ timestampsInSnapshots: true })

export default db;

export const expensesCollection = db.collection('expenses');