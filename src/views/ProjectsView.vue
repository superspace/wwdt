<template>
  <div class="container-fluid">

    <div class="row justify-content-center">
      <div class="col-md-4 col-lg-3">

        <b-list-group>

          <b-list-group-item a href="#" class="d-flex justify-content-center align-items-center" v-for="project in projects" :key="project.id" v-on:click.prevent="setActiveProject(project)">

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
    mounted: function () {

      this.getProjects()
        .then(()=>{
          if (this.projects && this.projects.length === 1 ) {
            const project = this.projects[0]
            this.setProject(project)
            router.push('/')
          }
        })
    },
    computed: {
        ...mapState('project', ['projects']),
    },
    methods: {
        ...mapActions('project', ['setProject', 'getProjects']),

        setActiveProject: function (project) {
            this.setProject(project)
            router.push('/')
        }
    }
}

</script>
