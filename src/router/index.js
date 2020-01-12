import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Registration from '../views/Registration.vue'
import Home from '../views/Home.vue'
import BootstrapVue from 'bootstrap-vue'
import store from '../store/index'
// Bootstrap.css
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
// Node Modules
const axios = require('axios');

Vue.use(BootstrapVue)
Vue.use(VueRouter)

// Axios
const instance = axios.create({
    timeout: 10000,
    headers: {'Content-Type': 'application/json'},
    withCredentials: true
});


const routes = [
  {
    path: '/',
    name: 'login',
    component: Login,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/register',
    name: 'register',
    component: Registration,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]


const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach( async (to, from, next) => {
    //console.log("Checking Route");
    // Check if the route requires authentication
    if(to.meta.requiresAuth) { 
        //console.log("Route Requires Auth");
        // check if the user is authenticated
        if(store.getters.isAuthenticated) { 
            //console.log("User Has Auth");
            // the next method allow the user to continue to the router 
            next(); 
        }else{
            //console.log("User Does Not Have Auth");
            // TODO: This should make an auth request that will check the users cookie to check if the user is already logged in, and log them in on this instance
            instance.get('api/auth/checkAuth.json')
            .then(async (response) => {
                if(response.status == 200){
                    //console.log("User Actually Has Auth")
                    // Setup Store
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
                        store.commit('login', userInfo);
                        if(store.getters.isAuthenticated){
                            next()
                        }else{
                            next('/');
                        }
                    }else{
                        next('/');
                    }
                }else{
                    next('/');
                }
            })
            .catch((error) => {
                next('/');
            });
        }
    }else {
        //console.log("Route Does Not Require Auth");
        // Go Wherever They Asked, No Auth Required For The Requested Route
        next()
    }
});


export default router
