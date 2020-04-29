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
      path: '*', 
      redirect: '/' 
    }
  ]
})

router.beforeEach((to, from, next) => {

  // redirect to login page if not logged in and trying to access a restricted page

  const publicPages = ['/login'];
  const authRequired = !publicPages.includes(to.path);
  
  if (authRequired) {

    if (!store.getters['user/isLoggedIn']()) {
    
      return next('/login');
    
    } else {

      const activeProject = store.state.project.project.id

      if (activeProject == undefined && to.path !== '/projects') {        
          return next('/projects')
      }
      return next()
    }
  }
  return next()
})

export default router