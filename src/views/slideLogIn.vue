<template>
<b-container fluid id="container">
	<b-form class="form-container sign-up-container" @signUp="signUp">
		<h1>Sign Up</h1>
		<b-row>
			<b-col cols="12" md="6">
				<b-form-input v-model="signUpForm.form.first_name" id="signUpfName" type='text' required placeholder="First Name"/>    
			</b-col>
			<b-col cols="12" md="6">
				<b-form-input v-model="signUpForm.form.last_name" id="signUplName" type='text' required placeholder="Last Name"/>
			</b-col>
		</b-row>
		<b-form-input v-model="username" id="signUpEmail" type="email" required placeholder="Email"/>
		<b-form-input v-model="signUpForm.form.password" id="signUpPassword" type="password" required placeholder="Password"/>
		<b-form-input v-model="signUpForm.form.verifyPassword" id="signUpotherPass" type="password" required placeholder="Re-enter password"/>
		<b-button type="signUp" variant="warning">Sign Up</b-button>
	</b-form>
	<b-form class="form-container sign-in-container" @signIn="signIn">
		<h1>Sign in</h1>
		<b-form-input v-model="username" id="signInEmail" type="email" required placeholder="Email"/>
		<b-form-input v-model="signInForm.form.password" id="signInPass" type="password" required placeholder="Password"/>
		<b-button type="signIn" variant="warning">Sign In</b-button>
	</b-form>
	<div class="overlay-container">
		<div class="overlay">
			<div class="overlay-panel overlay-left">
				<h1>Have an account?</h1>
				<p>We missed you! <br /> Press below to Sign In.</p>
				<b-button variant="warning" v-on:click="moveRight()" class="ghost" id="signIn">Sign In</b-button>
			</div>
			<div class="overlay-panel overlay-right">
				<h1>Create an account!</h1>
				<p>We are pumped to have you on board! <br /> Click below to start right away!</p>
				<b-button variant="warning" v-on:click="moveLeft()" class="ghost" id="signUp">Sign Up</b-button>
			</div>
		</div>
	</div>
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
	name:'login',
    data() {
        return {
			username: '',
            signInForm: {
                form: {
					password:''
				},
				invalidLogin: null,
				showIssueText: true,
				issueText: 'ISSUE',
				formWaiting: false,
			},
			signUpForm: {
				form: {
					first_name:'',
					last_name:'',
					password:'',
					verifyPassword:''
				},
				formWaiting: false,
				formComplete: false,
				formFailed: false,
				passwordVal: {
					hasNumber: false,
					hasUpper: false,
					hasSpecial: false,
					isLong: false,
				},
				passStrengthPillVariant: "secondary",
				passStrengthPillLabel: "Nothing Entered Yet"
			}
        }
	},
	computed: {
        usernameInvalidFeedback() {
            return "Must Be A Valid Email";
        },
    },
    methods: {
        signIn: function() {
			event.preventDefault();
			this.formWaiting = true;
			this.signInForm.form.username = this.username;
            var values = _.clone(this.signInForm.form);
            values.password = sha256(values.password);
            instance.post('api/auth/login.json', values)
            .then(async (response) => {
                this.formComplete = true;
                this.formWaiting = false;
                // Fetch User Info From userinfo Cookie
                var userInfo = null;
                var seekCookie = "userinfo=";
                var allRawCookies = document.cookie;
                //console.log(allRawCookies);
                var decodedCookies = decodeURIComponent(allRawCookies);
                //console.log(decodedCookies);
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
                    console.log(userInfo);
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
            console.log(this.signInForm)
        },
        signUp: function() {
			event.preventDefault();
            if(this.signUpForm.form.password != this.signUpForm.form.verifyPassword){
                // TODO: Add Form Alert When Not Matching
                return null;
            }
			this.formWaiting = true;
			this.signUpForm.form.username = this.username;
            var values = _.clone(this.signUpForm.form);
            console.log(values)
            values.password = sha256(values.password);
            values.verifyPassword = null;
            console.log(values)
            axios.post('api/auth/create.json', values)
            .then((response) => {
                this.formComplete = true;
                this.formWaiting = false;
                console.log(response);
            })
            .catch((error) => {
                this.formFailed = true;
                this.formWaiting = false;
                if(error.response.data.status == 403){
                    // TODO: This means that the user already exits
                    // Put Something On The Screen To Say That
                }
                console.log(error);
                console.log(error.response.data.status);
                console.log(error.response.data.info);
            });
            //alert(JSON.stringify(this.form));
		},
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
            console.log(str);
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
		usernameIsEmail(event){
            var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            console.log("Blur Email");
            this.state.username = emailRegex.test(this.form.username);
		},
		
        moveRight: function() {
            const container = document.getElementById('container');
            container.classList.remove('right-panel-active')
            // document.getElementById('signInEmail').value = "";
            document.getElementById('signInPass').value = "";
        },
        moveLeft: function() {
            const container = document.getElementById('container');
			container.classList.add('right-panel-active')
			document.getElementById('signUpfName').value = "";
			document.getElementById('signUplName').value = "";
			document.getElementById('signUpPassword').value = "";
			document.getElementById('signUpotherPass').value = "";
		},
		onChange(value) {
			this.signUpForm.email = this.signInForm.username;
            if(this.showIssueText){
                this.showIssueText = false;
                this.invalidLogin = null;
            }
        }
    }
}

</script>

<style lang="scss" scoped>
$warning-variant: #ffc107;

* {
	box-sizing: border-box;
}

body {
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	height: 100vh;
	margin: -20px 0 50px;
}

h1 {
	font-weight: bold;
	margin: 0;
	@media (max-width: 450px) {
    	font-size: 2rem;
    }
}

.inlineinput div {
    display: inline;
}

h2 {
	text-align: center;
}

p {
	font-size: 14px;
	font-weight: 100;
	line-height: 20px;
	letter-spacing: 0.5px;
	margin: 20px 0 30px;
}

span {
	font-size: 12px;
}

a {
	color: #333;
	font-size: 14px;
	text-decoration: none;
	margin: 15px 0;
}

button {
	border-radius: 20px;
	border: 1px solid #FF9C08;
	background-color: #FF9C08;
	color: #FFFFFF;
	font-size: 12px;
	font-weight: bold;
	padding: 12px 45px;
	letter-spacing: 1px;
	text-transform: uppercase;
	transition: transform 80ms ease-in;
    cursor: pointer;
	@media (max-width: 488px) {
    	padding: 6px 22px;
    }
	@media (max-width: 396px) {
    	padding: 3px 11px;
    }
}

button:active {
	transform: scale(0.95);
}

button:focus {
	outline: none;
}

button.ghost {
	background-color: transparent;
	border-color: #FFFFFF;
}

form {
	background-color: #FFFFFF;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	padding: 0 50px;
	height: 100%;
	text-align: center;
	@media (max-width: 720px) {
		padding: 0 40px;
    }
	@media (max-width: 630px) {
		padding: 0 30px;
    }
	@media (max-width: 540px) {
		padding: 0 20px;
    }
	@media (max-width: 450px) {
		padding: 0 10px;
    }
}

input {
	background-color: #eee;
	border: none;
	padding: 12px 15px;
	margin: 8px 0;
	width: 100%;
}

.container-fluid {
	background-color: #fff;
	border-radius: 10px;
	box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
	position: relative;
	overflow: hidden;
	width: 768px;
	max-width: 100%;
	min-height: 480px;
	margin-top: 10%;
}

.form-container {
	position: absolute;
	top: 0;
	height: 100%;
	transition: all 0.6s ease-in-out;
}

.sign-in-container {
	left: 0;
	width: 50%;
	z-index: 2;
}


.container-fluid.right-panel-active .sign-in-container {
	transform: translateX(100%);
}

.sign-up-container {
	left: 0;
	width: 50%;
	opacity: 0;
	z-index: 1;
}

.container-fluid.right-panel-active .sign-up-container {
	transform: translateX(100%);
	opacity: 1;
	z-index: 5;
	animation: show 0.6s;
}

@keyframes show {
	0%, 49.99% {
		opacity: 0;
		z-index: 1;
	}
	
	50%, 100% {
		opacity: 1;
		z-index: 5;
	}
}

.overlay-container {
	position: absolute;
	top: 0;
	left: 50%;
	width: 50%;
	height: 100%;
	overflow: hidden;
	transition: transform 0.6s ease-in-out;
	z-index: 100;
}

.container-fluid.right-panel-active .overlay-container{
	transform: translateX(-100%);
}

// FF9C08
// FFBA08

.overlay {
	background: #F69B29;
	background: -webkit-linear-gradient(to right, #FF9C08, #FFBA08);
	background: linear-gradient(to right, #FF9C08, #FFBA08);
	background-repeat: no-repeat;
	background-size: cover;
	background-position: 0 0;
	color: #FFFFFF;
	position: relative;
	left: -100%;
	height: 100%;
	width: 200%;
    transform: translateX(0);
	transition: transform 0.6s ease-in-out;
}

.container-fluid.right-panel-active .overlay {
    transform: translateX(50%);
}


.overlay-panel {
	position: absolute;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	padding: 0 40px;
	text-align: center;
	top: 0;
	height: 100%;
	width: 50%;
	transform: translateX(0);
	transition: transform 0.6s ease-in-out;
}

.overlay-left {
	transform: translateX(-20%);
}


.container-fluid.right-panel-active .overlay-left {
	transform: translateX(0);
}

.overlay-right {
	right: 0;
	transform: translateX(0);
}

.container-fluid.right-panel-active .overlay-right {
	transform: translateX(20%);
}
</style>