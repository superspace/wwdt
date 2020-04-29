<template>
  <div id="app">
      <div class="navbar navbar-light navbar-expand bg-light mb-3">

        <div class="collapse navbar-collapse">

          <a class="navbar-brand" href="#"><strong>/WWDT</strong></a>

          <ul class="navbar-nav">
            <li class="nav-item">
              <router-link class="nav-link" to="/">Composer</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/capture">Capture</router-link>
            </li>
          </ul>

        </div>

        <ul class="navbar-nav">
          <li class="nav-item" v-if="isLoggedIn()">
            <router-link class="nav-link" to="/login?logout=1">Logout</router-link>
          </li>
        </ul>

      </div>
    <router-view/>
  </div>
</template>

<style lang="scss">
</style>

<script>

import { mapGetters } from 'vuex'

export default {
  name: 'App',
  components: {
  },
  computed: {
    ...mapGetters('user', ['isLoggedIn'])
  }
}
</script>