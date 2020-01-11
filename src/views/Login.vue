<template>
    <b-container fluid>
        <div class="login">
            <div class="login-gauss"></div>
        </div>
        <b-row align-h="center" class="login-tall-row">
            <b-col cols="12" md="8" lg="6" xl="4" align-self="center" class="login-box">
                <b-row>
                    <b-col class="text-center">
                        <h3>Sign In</h3>
                        <hr>
                        <transition name="issueprompt">
                            <div v-show = "showIssueText" class="slim">
                                {{issueText}}
                            </div>
                        </transition>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col cols="12">
                        <b-form @submit="onSubmit">
                            <b-form-group
                                id="username-group"
                                label="Email"
                                label-for="username"
                            >
                                <b-form-input
                                    id="username"
                                    v-model="form.username"
                                    type="email"
                                    required
                                    :state="invalidLogin"
                                    @input="onChange"
                                ></b-form-input>
                            </b-form-group>
                            <b-form-group
                                id="password-group"
                                label="Password"
                                label-for="password"
                            >
                                <b-form-input
                                    id="password"
                                    v-model="form.password"
                                    required
                                    type="password"
                                    :state="invalidLogin"
                                    @input="onChange"
                                ></b-form-input>
                            </b-form-group>
                            <b-button block type="submit" variant="success">
                                <b-spinner v-if="formWaiting" label="Spinning"></b-spinner>
                                <span v-if="!formWaiting">Sign In</span>
                                </b-button>
                        </b-form>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col>
                        <hr>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col class="text-center">
                        <b-button variant="light" size="sm" :to="{ path: 'register'}" append>Create An Account</b-button>
                    </b-col>
                    <b-col class="text-center">
                        <b-button variant="light" size="sm">Forgot Your Password</b-button>
                    </b-col>
                </b-row>
                <b-row>
                    
                </b-row>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>

const axios = require('axios');
const uuidv4 = require('uuid/v4');
const jwt = require('jsonwebtoken');
const _ = require('underscore');
var sha256 = require('js-sha256');

const instance = axios.create({
    timeout: 10000,
    headers: {'Content-Type': 'application/json'},
    withCredentials: true
});

export default {
    name: 'login',
    components: {
    },
    data(){
        
        var formbase = {
            username:"",
            password:""
        };
        return{
            form: formbase,
            invalidLogin: null,
            showIssueText: false,
            issueText: '',
            formWaiting: false,
        }
    },
    methods: {
        onSubmit(event) {
            event.preventDefault();
            this.formWaiting = true;
            var values = _.clone(this.form);
            values.password = sha256(values.password);
            instance.post('api/auth/login', values)
            .then(async (response) => {
                this.formComplete = true;
                this.formWaiting = false;
                console.log(response.headers);
                //Get JWT
                var token = response.data.data.token;
                var user = response.data.data.user;
                var config = response.data.data.config;
                // var if_cookie_exists_expires = response.data.data.session;
                // localStorage.setItem('if_cookie_exists_expires', if_cookie_exists_expires);
                // console.log(response.data.data.session)
                this.$store.commit('setupUserConfigOnLogin', user, config);
                var a = await this.$store.commit('setJWTandAuthenticate', token);
                //console.log(this.$store.getters.getAuthPubkeyBuffer)
                //console.log(this.$store.getters.isAuthenticated);
                if(this.$store.getters.isAuthenticated){
                  this.$router.push({path:"/home"});
                }
            })
            .catch((error) => {
                this.formFailed = true;
                this.formWaiting = false;
                console.log(error);
                console.log(error.response.data.status);
                console.log(error.response.data.info);
                //Actions On 401
                if(error.response.data.status == 401){
                    if(error.response.data.info['0'].code = 4011){
                       this.invalidLogin = false; 
                       this.issueText = "Username or Password Invalid";
                       this.showIssueText = true;
                       
                    }
                }
            });
            //alert(JSON.stringify(this.form));
        },
        onChange(value) {
            if(this.showIssueText){
                this.showIssueText = false;
                this.invalidLogin = null;
            }
        }
    }
}
</script>

<style scoped>
.login {
    position: absolute;
    height:100vh;
    width:100vw;
    background-repeat: no-repeat;
    background-size: cover;
    background-position:right top;
    background-image: url('../assets/home-bg-min.jpg');
    background-attachment: fixed;
    margin: 0px;
    left:0px;
}
.login-gauss {
    position: absolute;
    height:100vh;
    width:100vw;
    background-color: rgba(0, 0, 0, 0.25);
    margin: 0px;
    left:0px;
}
.login-box {
    background-color: rgba(255, 255, 255, 0.40);
    border-radius: 1.5rem;
    padding-top: 1em;
    padding-bottom: 1.5em;
}
.login-tall-row{
    height: 100vh;
}
input{
    background-color: rgba(255, 255, 255, 0.60);
}
.issueprompt-enter-active, .issueprompt-leave-active {
    -webkit-transition-property: height; /* Safari */
    -webkit-transition-duration: 0.5s; /* Safari */
    transition-property: height;
    transition-duration: 0.5s;

}
.issueprompt-enter, .issueprompt-leave-to /* .fade-leave-active below version 2.1.8 */ {
    height: 50px;
}
.login {
  background-image: url('../assets/home-bg-min.jpg');
}
</style>

