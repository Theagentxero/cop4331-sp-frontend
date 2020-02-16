<template>
<b-container fluid>
    <div id="background"/>
    <b-form @submit="onSubmit">
        <b-row align-h="center" class="login-tall-row">
            <b-col cols="12" md="8" lg="6" xl="4" align-self="center" class="login-box">
                <b-row>
                    <b-col class="text-center">
                        <h3>Create An Account</h3>
                        <hr>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col cols="6">
                        <b-form-group
                            id="fname-group"
                            label="First Name"
                            label-for="first_name"
                        >
                            <b-form-input
                                id="first_name"
                                v-model="form.first_name"
                                required
                            ></b-form-input>
                        </b-form-group>
                    </b-col>
                    <b-col cols="6">
                        <b-form-group
                            id="lname-group"
                            label="Last Name"
                            label-for="last_name"
                        >
                            <b-form-input
                                id="last_name"
                                v-model="form.last_name"
                                required
                            ></b-form-input>
                        </b-form-group>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col cols="12">
                        <b-form-group
                            id="username-group"
                            label="Email"
                            label-for="username"
                            :state="state.username"
                            :invalid-feedback="usernameInvalidFeedback"
                        >
                            <b-form-input
                                id="username"
                                v-model="form.username"
                                type="email"
                                :state="state.username"
                                required
                                v-on:blur="usernameIsEmail()"
                                v-on:focus="editingEmail()"
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
                                type="password"
                                required
                                v-on:input="passwordStrength()"
                            ></b-form-input>
                            <b-badge pill :variant="passStrengthPillVariant">Password Strength: {{passStrengthPillLabel}}</b-badge>
                        </b-form-group>
                        <b-form-group
                            id="verify-password-group"
                            label="Verify Password"
                            label-for="verify-password" 
                        >
                            <b-form-input
                                id="verify-password"
                                v-model="form.verifyPassword"
                                type="password"
                                required
                            ></b-form-input>
                        </b-form-group>
                        <b-button block type="submit" variant="success">
                            <span v-if="!formWaiting" >Create Account</span>
                            <b-spinner v-if="formWaiting" label="Spinning"></b-spinner>
                            <span v-if="formComplete" class="glyphicon glyphicon-ok"></span>
                            <span v-if="formFailed" class="glyphicon glyphicon-remove"></span>
                        </b-button>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col>
                        <hr>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col class="text-center">
                        <b-button variant="light" size="sm" :to="{ path: '/'}">Already Have An Account?</b-button>
                    </b-col>
                    <b-col class="text-center">
                        <b-button variant="light" size="sm">Forgot Your Password</b-button>
                    </b-col>
                </b-row>
            </b-col>
        </b-row>
    </b-form>
</b-container>
</template>

<script>
const axios = require('axios');
const uuidv4 = require('uuid/v4');
const _ = require('underscore');
var sha256 = require('js-sha256');

const instance = axios.create({
    timeout: 10000,
    headers: {'Content-Type': 'application/json'},
    crossdomain: true
});

export default {
    name: 'login',
    components: {
    },
    data(){
        return{
            form: {},
            state:{
                username: null,
                password: null,
            },
            formWaiting: false,
            formComplete: false,
            formFailed: false,
            smallScreen: true,
            passwordVal: {
                hasNumber: false,
                hasUpper: false,
                hasSpecial: false,
                isLong: false,
            },
            passStrengthPillVariant: "secondary",
            passStrengthPillLabel: "Nothing Entered Yet"
        }
    },
    computed: {
        usernameInvalidFeedback() {
            return "Must Be A Valid Email";
        },
    },
    methods: {
        checkPasswordRequirements(){
            var isEightOrLonger = /^(?=.{8,72})/;
            var hasUppercase = /^(?=.*[A-Z])/;
            var hasNumber = /^(?=.*[0-9])/;
            var specialCharacters = /[^A-Za-z0-9]+/;
            var hasSpecialChar= /^(?=.[!@#\$%\^&])/;

            this.passwordVal.isLong = isEightOrLonger.test(this.form.password);
            this.passwordVal.hasNumber = hasNumber.test(this.form.password);
            this.passwordVal.hasSpecial = specialCharacters.test(this.form.password);
            this.passwordVal.hasUpper = hasUppercase.test(this.form.password);
        },
        checkPasswordMatch(event){
            
        },
        passwordStrength(){
            this.checkPasswordRequirements();
            var str = 0; 
            var meetsMin = false;
            if(this.passwordVal.isLong){str = str + 1; meetsMin = true;}
            if(this.passwordVal.hasNumber){str = str + 1;}
            if(this.passwordVal.hasSpecial){str = str + 1;}
            if(this.passwordVal.hasUpper){str = str + 1;}
            if(!meetsMin){
                str = 0;
            }
            if(str == 0){
                this.passStrengthPillLabel = "Unsuitable - Must Be 8 Characters Long"
                this.passStrengthPillVariant = "danger"
            }
            if(str == 1){
                this.passStrengthPillLabel = "Weak"
                this.passStrengthPillVariant = "warning"
            }
            if(str == 2){
                this.passStrengthPillLabel = "Marginal"
                this.passStrengthPillVariant = "secondary"
            }
            if(str == 3){
                this.passStrengthPillLabel = "Good"
                this.passStrengthPillVariant = "info"
            }
            if(str == 4){
                this.passStrengthPillLabel = "Excellent"
                this.passStrengthPillVariant = "success"
            }
        },
        editingEmail(){
            this.state.username = null;
        },
        usernameIsEmail(event){
            var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            this.state.username = emailRegex.test(this.form.username);

        },
        onSubmit(event) {
            event.preventDefault();
            if(this.form.password != this.form.verifyPassword){
                // TODO: Add Form Alert When Not Matching
                return null;
            }
            this.formWaiting = true;
            var values = _.clone(this.form);
            values.password = sha256(values.password);
            values.verifyPassword = null;
            axios.post('https://api.crabrr.com/auth/create.json', values)
            .then((response) => {
                this.formComplete = true;
                this.formWaiting = false;
            })
            .catch((error) => {
                this.formFailed = true;
                this.formWaiting = false;
                if(error.response.data.status == 403){
                    // TODO: This means that the user already exits
                    // Put Something On The Screen To Say That
                }
                console.log(error);
            });
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
</style>