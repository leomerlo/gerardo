<template>
  <div>
    <b-button v-b-toggle.sidebar><font-awesome-icon icon="fa-solid fa-bars" /></b-button>
    <b-sidebar id="sidebar" shadow>
      <template #header="{ hide }">
        <div class="d-flex justify-content-between w-100">
          Gerardo
          <b-button variant="icon" @click="hide"><font-awesome-icon icon="fa-solid fa-times" /></b-button>
        </div>
      </template>
      <b-button
        id="signOut"
        @click="signOutUser"
      >
        Sign out
      </b-button>
    </b-sidebar>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  methods: {
    ...mapActions([
      'signOutUser',
    ])
  }
}
</script>

<style lang="scss">

</style>