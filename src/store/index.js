import Vue from 'vue'
import Vuex from 'vuex'
import {Contact} from '../lib/contactHandler.js';

const _ = require('underscore');

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        Authenticated: false,
        user: {
            user_id: null,
            first_name: null,
            last_name: null
        },
        contacts: [],
        meta: {
            totalPages: 1,
            perPage: 24,
            count: 0,
            page: 1,

        }
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
        },
        getByID: state => id => {
            var contactList = _.pluck(state.contacts, "id");
            var idx = contactList.indexOf(id);
            //var index = state.contacts.map((e) => e.id).indexOf(id)
            if(idx == -1){
                return null;
            }else{
                return state.contacts[idx]
            }
        },
        getContactByLocalID: state => contact => {
            return state.contacts.filter((c)=> c.localID == contact.localID)[0];
        },
        perPage: state =>{
            return  state.meta.perPage;
        },
        totalPages: state =>{
            return state.meta.totalPages;
        },
        currentPage: state =>{
            return state.meta.page;
        },
        totalContacts: state =>{
            return state.meta.count;
        },
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
            state.contacts = [];
            var contacts = payload.contacts;
            // Create New Contact Class Item For Each Contact
            contacts.forEach(cont => {
                state.contacts.push( new Contact(cont));
            });
            state.meta.totalPages = payload.meta.totalPages;
            state.meta.count = payload.meta.totalContacts;
            state.meta.page = payload.meta.currentPage + 1;
        },
        addContact(state, payload) {
            //var newContact = payload.contact;
            state.contacts.push( new Contact(payload.contact))
            //state.contacts.push(payload.amount)
        },
        deleteContact(state, payload) {
            var contactList = _.pluck(state.contacts, "id");
            var idx = contactList.indexOf(payload.contact);
            if (idx > -1) {
                state.contacts.splice(idx, 1);
            }else{
                console.log("Did Not Find Contact To Delete")
            }
        },
        updateContact(state, payload) {
            var contactList = _.pluck(state.contacts, "id");
            var idx = contactList.indexOf(payload.contact.id);
            state.contacts[idx] = payload.contact;
        },
        searchedContacts(state, payload) {
            
        }
    },
    actions: {
    },
    modules: {
    }
})
