<template>
  <div id="app">
    <router-view/>
    <button
      v-if="isUserLogged"
      @click="signOutUser"
    >
      Sign out
    </button>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'App',
  computed: {
    ...mapGetters([
      'getUser',
    ]),
    isUserLogged() {
      return this.getUser?.uid;
    }
  },
  methods: {
    ...mapActions([
      'signOutUser',
    ])
  }
}
</script>