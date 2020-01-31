<template>
<div class="container" id="container">
	<div class="form-container sign-up-container">
		<form action="#">
            <h1>Sign Up</h1>
			<br />
        <div>
        <input v-model="signUpForm.fName" placeholder="First Name" id="signUpfName" type='text' style='display: inline; width: 132px; margin-right: 0.25cm;' />    
        <input v-model="signUpForm.lName" placeholder="Last Name" id="signUplName" type='text' style='display: inline; width: 132px; margin-left: 0.25cm;' />
		</div>
		<input v-model="signInForm.email" id="signUpEmail" type="email" placeholder="Email">
		<input v-model="signUpForm.password" id="signUpPassword" type="password" placeholder="Password">
		<input v-model="signUpForm.verifyPassword" id="signUpotherPass" type="password" placeholder="Re-enter password">
			<button v-on:click="signUp()" >Sign Up</button>
		</form>
	</div>
	<div class="form-container sign-in-container">
		<form action="#">
			<h1>Sign in</h1>
			<br />
			<input v-model="signInForm.email" type="email" placeholder="Email" id="signInEmail" />
			<input v-model="signInForm.password" type="password" placeholder="Password" id="signInPass" :state="passMin" />
			<button v-on:click="signIn()" >Sign In</button>
		</form>
	</div>
	<div class="overlay-container">
		<div class="overlay">
			<div class="overlay-panel overlay-left">
				<h1>Have an account?</h1>
				<p>We missed you! <br /> Press below to Sign In.</p>
				<button v-on:click="moveRight()" class="ghost" id="signIn">Sign In</button>
			</div>
			<div class="overlay-panel overlay-right">
				<h1>Create an account!</h1>
				<p>We are pumped to have you on board! <br /> Click below to start right away!</p>
				<button v-on:click="moveLeft()" class="ghost" id="signUp">Sign Up</button>
			</div>
		</div>
	</div>
</div>
</template>

<script>
export default {

    data() {
        return {
            signInForm: {
                email:'',
                password:'',
			},
			
			signUpForm: {
				fName:'',
				lName:'',
				password:'',
				verifyPassword:'',
			}
        }
    },

    methods: {
        signIn: function() {
            alert(JSON.stringify(this.signInForm))
        },

        signUp: function() {
			var x = this.signUpForm;
			x.email = this.signInForm.email;
            alert(JSON.stringify(x));
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
        }
    }
}

</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css?family=Montserrat:400,800');

* {
	box-sizing: border-box;
}

body {
	background: #f6f5f7;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	font-family: 'Montserrat', sans-serif;
	height: 100vh;
	margin: -20px 0 50px;
}

h1 {
	font-weight: bold;
	margin: 0;
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
}

input {
	background-color: #eee;
	border: none;
	padding: 12px 15px;
	margin: 8px 0;
	width: 100%;
}

.container {
	background-color: #fff;
	border-radius: 10px;
	box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
	position: relative;
	overflow: hidden;
	width: 768px;
	max-width: 100%;
	min-height: 480px;
	margin-top: 10%;
	@media (max-width: 1000px) {
    //   margin-top: 0%;
    }
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


.container.right-panel-active .sign-in-container {
	transform: translateX(100%);
}

.sign-up-container {
	left: 0;
	width: 50%;
	opacity: 0;
	z-index: 1;
}

.container.right-panel-active .sign-up-container {
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

.container.right-panel-active .overlay-container{
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

.container.right-panel-active .overlay {
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


.container.right-panel-active .overlay-left {
	transform: translateX(0);
}

.overlay-right {
	right: 0;
	transform: translateX(0);
}

.container.right-panel-active .overlay-right {
	transform: translateX(20%);
}
</style>