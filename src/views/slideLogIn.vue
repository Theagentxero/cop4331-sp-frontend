<template>
  <b-container fluid id="container">
    <b-form class="form-container sign-up-container" @submit="signUp">
      <h1>Sign Up</h1>
      <b-row>
        <b-col cols="12" md="6">
          <b-form-input 
            v-model="signUpForm.form.first_name"
            :state="(fNActive) ? first_name_state : null"
			      v-on:click="activateFirstName"
            aria-describedby="input-feedback"
            :id="`signUpfName`"
            type="text"
            placeholder="First Name"
            required
          />
        </b-col>
        <b-col cols="12" md="6">
          <b-form-input
            v-model="signUpForm.form.last_name"
			      :state="(lNActive) ? last_name_state : null"
			      v-on:click="activateLastName"
            aria-describedby="input-feedback"
            :id="`signUplName`"
            type="text"
            placeholder="Last Name"
          />
        </b-col>

      </b-row>
      <b-form-input 
        v-model="username"
        id="signUpEmail" 
        type="email" 
        placeholder="Email"
        required
      />

      <b-form-input
        v-model="signUpForm.form.password"
        :state="(pActive) ? password_name_state : null"
		    v-on:click="activatePassword"
        :id="`signUpPassword`"
        type="password"
        placeholder="Password"
        required
      />

      <b-popover
        :target="`signUpPassword`"
        :placement="`right`"
        triggers="focus"
        variant="info"
        >Enter at least 8 characters</b-popover>

      <b-form-input
        v-model="signUpForm.form.verifyPassword"
        :state="(vpActive) ? verifyPass_name_state : null"
		    v-on:click="activateVerifyPassword"
        id="signUpotherPass"
        type="password"
        placeholder="Re-enter password"
        required
      />
      <b-button type="submit" variant="warning" @click="signUp">Sign Up</b-button>
    </b-form>
    <b-form class="form-container sign-in-container" @submit="signIn">
      <h1>Sign in</h1>
      <b-form-input 
        v-model="username" 
        id="signInEmail" 
        type="email"
		    placeholder="Email" 
        required
      />
      <b-form-input
        v-model="signInForm.form.password"
        id="signInPass"
        type="password"
        placeholder="Password"
        required
      />

      <div class="form-group">
          <font size="2" id="error" color="red"></font>
 	    </div>

      <b-button type="submit" variant="warning" @click="signIn">Sign In</b-button>
    </b-form>
    <div class="overlay-container">
      <div class="overlay">
        <div class="overlay-panel overlay-left">
          <h1>Have an account?</h1>
          <p>
            We missed you!
            <br />Press below to Sign In.
          </p>
          <b-button variant="warning" v-on:click="moveRight()" class="ghost" id="signIn">Sign In</b-button>
        </div>
        <div class="overlay-panel overlay-right">
          <h1>Create an account!</h1>
          <p>
            We are pumped to have you on board!
            <br />Click below to start right away!
          </p>
          <b-button variant="warning" v-on:click="moveLeft()" class="ghost" id="signUp">Sign Up</b-button>
        </div>
      </div>
    </div>
  </b-container>
</template>

<script>

import {required, minLength, maxLength} from 'vuelidate/lib/validators'

const axios = require("axios");
const uuidv4 = require("uuid/v4");
const jwt = require("jsonwebtoken");
const _ = require("underscore");
var sha256 = require("js-sha256");

const instance = axios.create({
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true
});

export default {
  name: "login",
  data() {
    return {
      username: "",
	  fNActive: false,
	  lNActive: false,
	  emailActive: false,
	  pActive: false,
	  vpActive: false,
      signInForm: {
        form: {
          password: ""
        },
        invalidLogin: null,
        showIssueText: true,
        issueText: "ISSUE",
        formWaiting: false
      },
      signUpForm: {
        form: {
          first_name: "",
          last_name: "",
          password: "",
          verifyPassword: ""
        },
        formWaiting: false,
        formComplete: false,
        formFailed: false,
        passwordVal: {
          hasNumber: false,
          hasUpper: false,
          hasSpecial: false,
          isLong: false
        },
        passStrengthPillVariant: "secondary",
        passStrengthPillLabel: "Nothing Entered Yet"
      }
    };
  },
  computed: {
    usernameInvalidFeedback() {
      return "Must Be A Valid Email";
    },
    first_name_state() {
      return this.signUpForm.form.first_name.length > 0 ? true : false
    },
    last_name_state() {
      return this.signUpForm.form.last_name.length > 0 ? true : false
    },
    password_name_state() {
      return this.signUpForm.form.password.length >= 8 ? true : false
    },
    verifyPass_name_state() {
      var pass = this.signUpForm.form.password
      var verifyPass = this.signUpForm.form.verifyPassword
      return ((pass == verifyPass) && (verifyPass.length >= 8))
    },
    usernameInvalidFeedback() {
      return "Must Be A Valid Email";
    }
  },
  validations: {
    first_name: {
      required,
      minLength: minLength(3),
    },
    last_name: {
      required,
      minLength: minLength(3),
    }
  },
  methods: {
    signIn: function() {
      event.preventDefault();
      this.formWaiting = true;
      var values = {};
      values.username = this.username;
      values.password = sha256(this.signInForm.form.password);
      instance
        .post("api/auth/login.json", values)
        .then(async response => {
          this.formComplete = true;
          this.formWaiting = false;
          // Fetch User Info From userinfo Cookie
          var userInfo = null;
          var seekCookie = "userinfo=";
          var allRawCookies = document.cookie;
          var decodedCookies = decodeURIComponent(allRawCookies);
          // Split Cookies
          var cookiesAry = decodedCookies.split(";");
          // Find The Correct Cookie
          var match = null;
          cookiesAry.forEach(raw => {
            var loc = raw.indexOf(seekCookie);
            if (loc != -1) {
              // Found The Cookie With Our Name
              match = raw;
            }
          });
          if (match != null) {
            var tmpVal = match.substring(seekCookie.length, match.length);
            userInfo = JSON.parse(tmpVal);
            this.$store.commit("login", userInfo);
            if (this.$store.getters.isAuthenticated) {
              this.$router.push({ path: "/contacts" });
            } else {
              console.log("Not Authenticated");
            }
          } else {
            // TODO: Make Some User Alert To Inform User That Cookie Is Missing
          }
        })
        .catch(error => {
          this.formFailed = true;
		  this.formWaiting = false;
		  // TODO: Handle Errors
		  var errorNum = error.response.status
		  
		  // 400 code means invalid email has been written
		  // 403 code means valid email but not existing user
      // 401 means email exists but password is wrong
      
      if (errorNum == 400)
       {
         document.getElementById('error').innerHTML = "Oops, that password is wrong"; 
       }
       if (errorNum == 401)
       {
         document.getElementById('error').innerHTML = "Oops, that password is wrong";

       }
       if (errorNum == 403)
       {
         document.getElementById('error').innerHTML = "We don't recognize this email, let's create an account!"; 
       }

        });
    },
    signUp: function() {
      event.preventDefault();
      if (
        this.signUpForm.form.password != this.signUpForm.form.verifyPassword
      ) {
        // TODO: Add Form Alert When Not Matching
        return null;
      }
      this.formWaiting = true;
      this.signUpForm.form.username = this.username;
      var values = _.clone(this.signUpForm.form);
      values.password = sha256(values.password);
      values.verifyPassword = null;
      axios
        .post("api/auth/create.json", values)
        .then(response => {
          this.formComplete = true;
          this.formWaiting = false;
        })
        .catch(error => {
          this.formFailed = true;
          this.formWaiting = false;
          if (error.response.data.status == 403) {
            // TODO: This means that the user already exits
            // Put Something On The Screen To Say That
          }
          // Can Throw ERRORS
          // 403 - Username already exists
          console.log(error);
        });
      //alert(JSON.stringify(this.form));
    },
    checkPasswordRequirements() {
      var isEightOrLonger = /^(?=.{8,72})/;
      var hasUppercase = /^(?=.*[A-Z])/;
      var hasNumber = /^(?=.*[0-9])/;
      var specialCharacters = /[^A-Za-z0-9]+/;
      var hasSpecialChar = /^(?=.[!@#\$%\^&])/;

      this.passwordVal.isLong = isEightOrLonger.test(this.form.password);
      this.passwordVal.hasNumber = hasNumber.test(this.form.password);
      this.passwordVal.hasSpecial = specialCharacters.test(this.form.password);
      this.passwordVal.hasUpper = hasUppercase.test(this.form.password);
    },
    passwordStrength() {
      this.checkPasswordRequirements();
      var str = 0;
      var meetsMin = false;
      if (this.passwordVal.isLong) {
        str = str + 1;
        meetsMin = true;
      }
      if (this.passwordVal.hasNumber) {
        str = str + 1;
      }
      if (this.passwordVal.hasSpecial) {
        str = str + 1;
      }
      if (this.passwordVal.hasUpper) {
        str = str + 1;
      }
      if (!meetsMin) {
        str = 0;
      }
      if (str == 0) {
        this.passStrengthPillLabel = "Unsuitable - Must Be 8 Characters Long";
        this.passStrengthPillVariant = "danger";
      }
      if (str == 1) {
        this.passStrengthPillLabel = "Weak";
        this.passStrengthPillVariant = "warning";
      }
      if (str == 2) {
        this.passStrengthPillLabel = "Marginal";
        this.passStrengthPillVariant = "secondary";
      }
      if (str == 3) {
        this.passStrengthPillLabel = "Good";
        this.passStrengthPillVariant = "info";
      }
      if (str == 4) {
        this.passStrengthPillLabel = "Excellent";
        this.passStrengthPillVariant = "success";
      }
    },
    usernameIsEmail(event) {
      var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      this.state.username = emailRegex.test(this.form.username);
    },

    moveRight: function() {
      const container = document.getElementById("container");
      container.classList.remove("right-panel-active");
      // document.getElementById('signInEmail').value = "";
      document.getElementById("signInPass").value = "";
    },
    moveLeft: function() {
      const container = document.getElementById("container");
      container.classList.add("right-panel-active");
      document.getElementById("signUpfName").value = "";
      document.getElementById("signUplName").value = "";
      document.getElementById("signUpPassword").value = "";
      document.getElementById("signUpotherPass").value = "";
    },
    onChange(value) {
      this.signUpForm.email = this.signInForm.username;
      if (this.showIssueText) {
        this.showIssueText = false;
        this.invalidLogin = null;
      }
    },
    activateFirstName() { this.fNActive = true },
    activateLastName() { this.lNActive = true },
    activateEmail() { this.emailActive = true },
    activatePassword() { this.pActive = true },
    activateVerifyPassword() { this.vpActive = true }
	},
};
</script>

<style lang="scss" scoped>
$dark-orange: #FFC107;


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
  border: 1px solid $dark-orange;
  background-color: $dark-orange;
  color: #ffffff;
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
  border-color: #ffffff;
}

#container {
  // color: $warning-variant;
  color: black;
}

form {
  background-color: #fff;
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
  background-color: #eee;
  border-radius: 10px;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  position: relative;
  overflow: hidden;
  width: 850px;
  max-width: 100%;
  min-height: 480px;
  // margin-top: 10%;
  top: 20vh;
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
  0%,
  49.99% {
    opacity: 0;
    z-index: 1;
  }

  50%,
  100% {
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

.container-fluid.right-panel-active .overlay-container {
  transform: translateX(-100%);
}

// FF9C08
// FFBA08

.overlay {
  background: #f69b29;
  background: linear-gradient(to right, $dark-orange, $warning-variant);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 0 0;
  color: #242424;
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