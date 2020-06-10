<template>
  <div id="app">
      <div class="navbar navbar-light navbar-expand bg-light mb-3">

        <div class="collapse navbar-collapse">

          <router-link class="navbar-brand" to="/"><strong>/WWDT</strong></router-link>

          <div class="ml-3 d-none d-md-block" v-if="project">

            <strong>
              {{project.title}}
            </strong>

            <b-badge class="ml-1" v-if="sessionMode === MODE_RECORD">
              <b-icon-circle-fill class="mr-1"></b-icon-circle-fill> RECORDING
            </b-badge>

            <b-badge class="ml-1" v-if="sessionMode === MODE_EDIT">
              <b-icon-pencil class="mr-1"></b-icon-pencil> EDITING
            </b-badge>

          </div>

          <ul class="navbar-nav ml-3">
            <li class="nav-item">
              <router-link class="nav-link" to="/projects">All Projects</router-link>
            </li>
          </ul>

        </div>

        <span class="d-none d-md-block">
          <b-icon-person-fill></b-icon-person-fill> {{ firstname }} {{ lastname }} <b-badge pill v-if="role">{{ role }}</b-badge>
        </span> 
        <ul class="navbar-nav">
          <li class="nav-item" v-if="isLoggedIn()">
            <router-link class="btn btn-primary btn-sm ml-4" to="/login?logout=1">Logout</router-link>
          </li>
        </ul>

      </div>
    <router-view/>
  </div>
</template>

<style lang="scss">
</style>

<script>

import { mapGetters, mapState, mapActions } from 'vuex'

export default {
  name: 'App',
  mounted: function () {
    this.getUser()
  },
  components: {
  },
  computed: {
    ...mapState('user', ['firstname', 'lastname', 'role']),
    ...mapState('project', ['project','MODE_EDIT', 'MODE_RECORD']),

    ...mapGetters('user', ['isLoggedIn']),
    ...mapGetters('project', ['sessionMode'])

  },
  methods: {
    ...mapActions('user', ['getUser'])
  }
}
</script>