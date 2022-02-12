<template>
  <div>
    <h1>Gerardo</h1>
    <p>Logueate para comenzar</p>
    <button @click="loginUser">
      Login
    </button>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: "Login",
  methods: {
    ...mapActions([
      'loginUser',
    ])
  }
}
</script>

<style>

</style>