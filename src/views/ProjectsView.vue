<template>
  <div class="container-fluid">

    <div class="row justify-content-center">

      <!-- <pre>
       {{ response }}
      </pre> -->

      <div class="col-md-4 col-lg-3">

        <b-list-group>

          <b-list-group-item a href="#" class="d-flex justify-content-center align-items-center" 
            v-for="project in projects" 
            :key="project.id" v-on:click.prevent="setActiveProject(project)">

              {{ project.title }}

          </b-list-group-item>

        </b-list-group>

      </div>
    </div>

  </div>
</template>

<script>

import router from '../router'

import { mapState, mapActions, mapGetters } from 'vuex'

export default {
    name: 'ProjectsView',
    components: {

    },
    mounted: function () {

      this.resetProject()

      this.getProjects()
        .then(()=>{

          if (this.project.id == undefined) {
            if (this.projects && this.projects.length === 1 ) {
              const project = this.projects[0]
              this.setActiveProject(project)
            }
          }

        })
    },
    computed: {
        ...mapState('project', ['projects', 'project']),
        ...mapState('user', ['id', 'email','response']),

        ...mapGetters('user', ['authKey'])
    },
    methods: {
        ...mapActions('project', ['setProject', 'getProjects', 'resetProject']),

        ...mapActions('user', ['getUser']),

        setActiveProject: function (project) {

            this.setProject(project)
            router.push('/')
        }
    }
}

</script>
