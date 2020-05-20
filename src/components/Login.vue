<template>
    <div class="pt-4">
        
        <h3 v-if="state == 'INITIAL' || state == 'ERROR'">Login</h3>

        <b-alert variant="danger" :show="state == 'ERROR'">
            <b-icon-exclamation-triangle></b-icon-exclamation-triangle> {{errorMessage}}
        </b-alert>

        <b-alert variant="success" :show="state == 'SUCCESS'">
            Der Login-Link wurde per E-Mail versendet und kann einmalig verwendet werden.
        </b-alert>

        <b-form ref="formSendLoginLink" @submit.stop.prevent="handleSendLoginLink" novalidate v-if="state == 'INITIAL' || state == 'ERROR'">

            <b-form-group label="E-Mail" label-for="email"
                :state="emailState" 
                invalid-feedback="E-Mail is required">
                <b-form-input @blur="validateFormSendLoginLink" id="email" type="email" v-model="email" :state="emailState" required />
            </b-form-group>

            <div class="form-group">
                <button class="btn btn-primary">Request Login Link</button>
            </div>

        </b-form>



    </div>
</template>

<script>

import { mapState, mapActions } from 'vuex'
import Axios from "axios"


export default {
    name: 'login',
    components: {
    },
    data () {
        return {
            email: '',
            token: '',
            state: '',
            errorMessage: '',
            emailState: null
        }
    },
    created: function () {
        if (this.$route.query.logout) {
            this.logout()
        }

        this.email = this.$route.query.email
        this.token = this.$route.query.token

        if (this.email && this.token) {
            this.handleLogin()
        } else {
            this.state = 'INITIAL'
        }

    },
    computed: {
        ...mapState('user', []),

    },
    methods: {

        ...mapActions('user', ['login','logout']),

        validateFormSendLoginLink: function () {
            const valid = this.$refs.formSendLoginLink.checkValidity()
            this.emailState = valid
            return valid
        },

        handleSendLoginLink: function () {

            if (this.validateFormSendLoginLink()) {

                let data = new FormData
                data.append('email', this.email)
                Axios.post('/user/resend-login-link', data)
                    .then((resp) => {
                        if (resp.data.status == 'OK') {
                            this.state = 'SUCCESS'
                        }
                    })
                    .catch(() => {
                        this.state = 'ERROR'
                        this.email = ''
                        this.emailState = null
                    })
            }
        },

        handleLogin: function () {

            const payload = {
                email: this.email,
                token: this.token
            }

            this.login(payload)
                .then(() => {
                    this.$router.push('projects')
                })
                .catch(error => {

                    if (error.response && error.response.data.errors) {
                        for (let key in error.response.data.errors) {
                            let message = error.response.data.errors[key]                        
                            this.errorMessage = message[0]
                        }
                    }

                    this.state = 'ERROR'
                    this.email = ''
                    this.token = ''
                })
        }
    }
}
</script>

<style lang="scss">

</style>