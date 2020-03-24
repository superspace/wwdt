<template>
  <div class="container-fluid">

    <div class="row justify-content-center">
      <div class="col-md-4 col-lg-3">

        <b-list-group>

          <b-list-group-item a href="#" class="d-flex justify-content-center align-items-center" v-for="project in projects" :key="project.id" v-on:click.prevent="setProject(project)">

              {{ project.title }}

          </b-list-group-item>

        </b-list-group>

      </div>
    </div>

  </div>
</template>

<script>

import router from '../router'

import { mapState, mapActions } from 'vuex'

export default {
    name: 'ProjectsView',
    components: {

    },
    computed: {
        ...mapState('project', ['projects']),
    },
    methods: {
        ...mapActions('project', ['setActiveProject']),

        setProject: function (project) {
            this.setActiveProject(project)
            router.push('/')
        }
    }
}

</script>
