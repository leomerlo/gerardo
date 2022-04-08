<template>
  <div id="app">
    <button
      id="signOut"
      v-if="isUserLogged"
      @click="signOutUser"
    >
      Sign out
    </button>
    <router-view v-slot="{ Component }">
      <transition>
        <component :is="Component" />
      </transition>
    </router-view>
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