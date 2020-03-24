<template>
  <div class="container-fluid">

    <div class="row justify-content-center">
      <div class="col-md-4 col-lg-3">

        <login></login>

      </div>
    </div>

  </div>
</template>

<script>
import Login from '@/components/Login'

export default {
    name: 'LoginView',
    components: {
      Login
    }
}

</script>
