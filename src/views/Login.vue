<template>
    <b-container fluid>
        <div id="background"/>
        <b-row align-h="center" class="login-tall-row">
            <b-col cols="12" md="8" lg="6" xl="4" align-self="center" class="login-box">
                <b-row>
                    <b-col class="text-center">
                        <h3>Sign In</h3>
                        <hr>
                        <transition name="issueprompt">
                            <div v-show="showIssueText">
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
            showIssueText: true,
            issueText: 'ISSUE',
            formWaiting: false,
        }
    },
    methods: {
        onSubmit(event) {
            event.preventDefault();
            this.formWaiting = true;
            var values = _.clone(this.form);
            values.password = sha256(values.password);
            instance.post('api/auth/login.json', values)
            .then(async (response) => {
                this.formComplete = true;
                this.formWaiting = false;
                // Fetch User Info From userinfo Cookie
                var userInfo = null;
                var seekCookie = "userinfo=";
                var allRawCookies = document.cookie;
                var decodedCookies = decodeURIComponent(allRawCookies);
                // Split Cookies
                var cookiesAry = decodedCookies.split(';');
                // Find The Correct Cookie
                var match = null;
                cookiesAry.forEach(raw => {
                    var loc = raw.indexOf(seekCookie);
                    if(loc != -1){
                        // Found The Cookie With Our Name
                        match = raw;
                    }
                });
                if(match != null){
                    var tmpVal = match.substring(seekCookie.length, match.length);
                    userInfo = JSON.parse(tmpVal)
                    this.$store.commit('login', userInfo);
                    if(this.$store.getters.isAuthenticated){
                        this.$router.push({path:"/home"});
                    }else{
                        console.log("Not Authenticated");
                    }
                }else{
                    // TODO: Make Some User Alert To Inform User That Cookie Is Missing
                }
            })
            .catch((error) => {
                this.formFailed = true;
                this.formWaiting = false;
                // TODO: Handle Errors
            });
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

<style lang="scss" scoped>
@import '../assets/scss/_mixins.scss';

#background {
    @include cowboy-background;
}

@include input-box-design(".login-tall-row", ".login-box");

// https://vuejs.org/v2/guide/transitions.html
.issueprompt-enter-active, .issueprompt-leave-active {
    transition-property: height;
    transition-duration: 0.5s;
}
.issueprompt-enter, .issueprompt-leave-to /* .fade-leave-active below version 2.1.8 */ {
    height: 50px;
}
</style>

