<template>
  <div>
    <router-link
      :to="{ name: $route.name, params: goBackMonth}"
    >
      Mes Anterior
    </router-link>
    <router-link
      :to="{ name: $route.name, params: currentDate}"
    >
      Mes Actual
    </router-link>
    <router-link
      :to="{ name: $route.name, params: goNextMonth}"
    >
      Mes Siguente
    </router-link>
  </div>
</template>

<script>
import DateHelpersMixin from '@/mixins/dateHelpers.vue';

export default {
  name: "monthNavigator",
  mixins: [
    DateHelpersMixin,
  ],
  computed: {
    goBackMonth: function() {
      if(this.parsedMonth === 1){
        return {
          month: 12,
          year: this.parsedYear - 1,
        }
      } else {
        return {
          month: this.parsedMonth - 1,
          year: this.parsedYear,
        }
      }
    },
    goNextMonth: function() {
      if(this.parsedMonth === 12){
        return {
          month: 1,
          year: this.parsedYear + 1,
        }
      } else {
        return {
          month: this.parsedMonth + 1,
          year: this.parsedYear,
        }
      }
    }
  }
}
</script>

<style>

</style>