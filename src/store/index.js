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
        },
        contacts: []
    },
    getters: {
        getFullName: state => {
            return state.user.first_name + " " + state.user.last_name;
        },
        getFirstName: state => {
            return state.user.first_name;
        },
        getUserId: state => {
            return state.user.user_id;
        },
        isAuthenticated: state => {
            return state.Authenticated;
        },
        getContacts: state => {
            return state.contacts;
        }
    },
    mutations: {
        logout(state) {
            state.Authenticated = false;
            state.user = {
                user_id: null,
                first_name: null,
                last_name: null
            };
            state.contacts = [];
        },
        login(state, user) {
            state.Authenticated = true;
            state.user = user
        },
        loadContacts(state, payload) {
            state.contacts = payload.amount
        },
        addContact(state, payload) {
            state.contacts.push(payload.amount)
        },
        deleteContact(state, payload) {
            var index = state.contacts.map((e) => e._id).indexOf(payload.amount);

            console.log(index)

            if (index > -1) {
                state.contacts.splice(index, 1);
            }
        },
        updateContact(state, payload) {
            var index = state.contacts.indexOf(payload.amount._id);
            state.contacts[index] = payload.amount;
        }
    },
    actions: {
    },
    modules: {
    }
})
