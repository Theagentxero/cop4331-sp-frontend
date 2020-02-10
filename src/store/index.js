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
        },
        getByID: state => id => {
            var contactList = _.pluck(state.contacts, "id");
            var idx = contactList.indexOf(id);
            //var index = state.contacts.map((e) => e.id).indexOf(id)
            if(idx == -1){
                console.log("Search For Deleted Contact")
                return null;
            }else{
                console.log("Found Contact")
                return state.contacts[idx]
            }
        },
        getContactByLocalID: state => contact => {
            console.log("Update By Local ID")
            console.log(contact)
            return state.contacts.filter((c)=> c.localID == contact.localID)[0];
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
            state.contacts = [];
            var contacts = payload.contacts;
            // Create New Contact Class Item For Each Contact
            contacts.forEach(cont => {
                state.contacts.push( new Contact(cont));
            });
        },
        addContact(state, payload) {
            //var newContact = payload.contact;
            state.contacts.push( new Contact(payload.contact))
            //state.contacts.push(payload.amount)
        },
        deleteContact(state, payload) {
            console.log("Delete Contact")
            var contactList = _.pluck(state.contacts, "id");
            console.log(contactList);
            console.log("Searching For " + payload.contact)
            var idx = contactList.indexOf(payload.contact);
            console.log(idx);
            if (idx > -1) {
                console.log("Found Contact To Delete")
                state.contacts.splice(idx, 1);
            }else{
                console.log("Did Not Find Contact To Delete")
            }
        },
        updateContact(state, payload) {
            var contactList = _.pluck(state.contacts, "id");
            var idx = contactList.indexOf(payload.contact.id);
            state.contacts[idx] = payload.contact;
            // console.log(contactList);
            // console.log(idx);
            // var index = state.contacts.map((e) => e._id).indexOf(payload.amount._id)
            // state.contacts[index] = payload.amount;
        },
        searchedContacts(state, payload) {
            
        }
    },
    actions: {
    },
    modules: {
    }
})
