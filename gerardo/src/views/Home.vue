<template>
  <div>
    <h1>Hola</h1>
    <ul>
      <li
        v-for="document in documents"
        :key="document.id"
      >
        {{ document.name }}
        {{ document.value }}
        {{ document.recurrent }}
      </li>
    </ul>
  </div>
</template>

<script>
import db from '@/db'

export default {
  name: 'Home',
  data() {
    return {
      documents: [],
    }
  },
  created() {
    console.log(this.documents);
  },
  firestore: {
    documents: db.collection('expenses'),
  },
}
</script>

<style>

</style>