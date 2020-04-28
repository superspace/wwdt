<template>
    <div>
        <h2>Login</h2>
        <form @submit.prevent="handleSubmit">
            <!-- <div class="form-group">
                <label>E-Mail</label>
                <input type="email" class="form-control" v-model="email" required>
            </div>
            <div class="form-group">
                <label>Token</label>
                <input type="token" class="form-control" v-model="token" required>
            </div> -->
            <div class="form-group">
                <button class="btn btn-primary">Login</button>
            </div>
        </form>
    </div>
</template>

<script>

import { mapState, mapActions } from 'vuex'

export default {
    name: 'login',
    components: {
    },
    data () {
        return {
            email: 'dev@superspace.ch',
            token: '4CqnNf2Wm7jeiqZEShb6v0ZhQH4ZEkYI',
            submitted: false
        }
    },
    created: function () {

    },
    computed: {
        ...mapState('user', [])
    },
    methods: {

        ...mapActions('user', ['login']),

        handleSubmit: function () {
            this.submitted = true

            const payload = {
                email: this.email,
                token: this.token
            }

            this.login(payload)
                .then(() => {
                    this.$router.push('/')
                })
        }
    }
}
</script>

<style lang="scss">

</style>