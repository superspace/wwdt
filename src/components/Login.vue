<template>
    <div>
        <h2>Login</h2>
        <form @submit.prevent="handleSubmit">
            <div class="form-group">
                <label>Username</label>
                <input type="text" class="form-control" v-model="username" required>
            </div>
            <div class="form-group">
                <label>Password</label>
                <input type="password" class="form-control" v-model="password" required>
            </div>
            <div class="form-group">
                <button class="btn btn-primary">Login</button>
            </div>
        </form>
    </div>
</template>

<script>

import router from '../router'

export default {
    name: 'login',
    components: {
    },
    data () {
        return {
            username: '',
            password: '',
            submitted: false
        }
    },
    created: function () {
        localStorage.removeItem('user');
    },
    methods: {
        handleSubmit: function () {
            this.submitted = true
            if (this.username === 'moderator') {
                const user = {username: 'Moderator', token: 'fake-token'}
                localStorage.setItem('user', JSON.stringify(user))
            } else if (this.username === 'user') {
                const user = {username: 'User', token: 'fake-token'}
                localStorage.setItem('user', JSON.stringify(user))
            } 
            router.push('/')
        }
    }
}
</script>

<style lang="scss">

</style>