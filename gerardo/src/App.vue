<template>
  <div id="app" class="container">
    <side-bar v-if="isUserLogged" />
    <router-view/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import sideBar from './components/sideBar.vue';
export default {
  components: { sideBar },
  name: 'App',
  computed: {
    ...mapGetters([
      'getUser',
    ]),
    isUserLogged() {
      return this.getUser?.uid;
    }
  },
}
</script>