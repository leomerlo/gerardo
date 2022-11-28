<template>
  <div class="d-flex flex-column align-items-center justify-content-center vh-100 text-center">
    <div class="container">
      <h1>Gerardo</h1>
      <p>Logueate para comenzar</p>
      <b-button variant="primary" @click="loginUser">
        Login
      </b-button>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: "LoginPage",
  methods: {
    ...mapActions([
      'loginUser',
    ])
  }
}
</script>

<style>

</style>