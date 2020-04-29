<template>
  <div id="app">
      <div class="navbar navbar-light navbar-expand bg-light mb-3">

        <div class="collapse navbar-collapse">

          <router-link class="navbar-brand" to="/"><strong>/WWDT</strong></router-link>

          <ul class="navbar-nav">
            <li class="nav-item">
              <router-link class="nav-link" to="/projects">Projects</router-link>
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