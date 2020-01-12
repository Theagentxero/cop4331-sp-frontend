import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        Authenticated: false,
        user: {
            user_id: null,
            first_name: null,
            last_name: null
        }
    },
    getters: {
        getFullName: state =>{
            return state.user.first_name + " " + state.user.last_name;
        },
        getFirstName: state =>{
            return state.user.first_name;
        },
        getUserId: state =>{
            return state.user.user_id;
        },
        isAuthenticated: state =>{
            return state.Authenticated;
        }
    },
    mutations: {
        logout(state){
            state.Authenticated = false;
            state.user = {
                user_id: null,
                first_name: null,
                last_name: null
            };
        },
        login(state, user){
            state.Authenticated = true;
            state.user = user
        }
    },
    actions: {
    },
    modules: {
    }
})
