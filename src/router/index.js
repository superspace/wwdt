import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'

import HomeView from '../views/HomeView'
import LoginView from '../views/LoginView'

Vue.use(Router)


const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/projects',
      name: 'projects',
      component: () => import('../views/ProjectsView.vue')
    },
    {
      path: '/capture',
      name: 'capture',
      component: () => import('../views/CaptureView.vue')
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/AdminView.vue')
    },
    { 
      path: '*', 
      redirect: '/' 
    }
  ]
})

router.beforeEach((to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ['/login'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('user');
  const activeProject = store.state.project.project.id

  // console.log(store.state.project.project); // eslint-disable-line no-console

  if (authRequired) {

    if (!loggedIn) {
      return next('/login');
    } else if (!activeProject && to.path !== '/projects') {
      if (store.state.project.projects.length === 1 ) {
        const project = store.state.project.projects[0]
        store.dispatch('project/setProject', project)        
        return next()
      } else {
        return next('/projects')
      }
    }
    return next()
  }
  return next()
})

export default router