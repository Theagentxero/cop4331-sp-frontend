<template>
  <div>
    <Navbar @searchContacts='searchContacts'/>
    
    <AddContact />

    <!-- <ContactList :contactSections='contactSections'/> -->
    <div>
        <b-container class="contacts p-2">
            <b-row>
                <contact-item @deleted="delUpdate" v-for="contact in allContacts" :key="contact.localID" :initContact="contact"/>
            </b-row>
            <b-row>
          <b-pagination v-if="!pageStatus.waitingOnAPICall"
              align="right"
              v-model="currentPage"
              v-on:change="pageChanges($event)"
              :total-rows="count"
              :per-page="perPage"
            ></b-pagination>
          </b-row>
        </b-container>
    </div>
  </div>
</template>

<script>
import Navbar from './Navbar.vue';
import AddContact from './AddContact.vue'
//import ContactList from './ContactList.vue'
import ContactItem from './ContactItem.vue'

const _ = require('underscore');
const axios = require('axios');
const {Contact} = require('../lib/contactHandler.js');

const instance = axios.create({
    timeout: 10000,
    headers: {'Content-Type': 'application/json'},
    withCredentials: true
});

export default {
  name: 'Contacts',
  components: {
      'contact-item': ContactItem,
    Navbar,
    AddContact,
    //ContactList
  },
  data() {
    return {
      contactSections: [],
      pageStatus: {
        waitingOnAPICall: false
      },
      currentPage: 1,
      count: 0,
      perPage: 24
    }
  },
  computed:{
      allContacts(){
          return this.$store.getters.getContacts;
      }
  },
  methods: {
    fetchContacts() {
        this.pageStatus.waitingOnAPICall = true;
        instance.get('https://api.crabrr.com/contacts')
            .then(async (response) => {
              console.log("received response")
                this.pageStatus.waitingOnAPICall = false;
                this.$store.commit('loadContacts', {contacts: response.data.result, meta:response.data.meta});
                this.currentPage = this.$store.getters.currentPage;
                this.count = this.$store.getters.totalContacts;
                this.perPage = this.$store.getters.perPage;
                //this.$store.commit({type: 'loadContacts', amount: response.data.result})
                this.contactSections = this.$store.getters.getContacts
            })
            .catch((error) => {
                this.pageStatus.waitingOnAPICall = false;
                // TODO: Handle Errors
                console.log(error);
            });
    },
    searchContacts(payload) {
        this.contactSections = this.$store.getters.getContacts
        this.currentPage = this.$store.getters.currentPage;
        this.count = this.$store.getters.totalContacts;
        this.perPage = this.$store.getters.perPage;
    },
    delUpdate(){
        this.contactSections = this.$store.getters.getContacts;
    },
    pageChanges(event){
      console.log(event);
      this.pageStatus.waitingOnAPICall = true;
      instance.get(`https://api.crabrr.com/contacts?page=${event-1}&perpage=${this.perPage}`)
        .then(async (response) => {
          this.pageStatus.waitingOnAPICall = false;
          this.$store.commit('loadContacts', {contacts: response.data.result, meta:response.data.meta});
          this.currentPage = this.$store.getters.currentPage;
          this.count = this.$store.getters.totalContacts;
          this.perPage = this.$store.getters.perPage;
          //this.$store.commit({type: 'loadContacts', amount: response.data.result})
          this.contactSections = this.$store.getters.getContacts
        })
        .catch((error) => {
          this.pageStatus.waitingOnAPICall = false;
          // TODO: Handle Errors
          console.log(error);
        });
    }
  },
  beforeMount() {

    this.fetchContacts();
  }
}
</script>

<style lang="scss" scoped>
$dark-orange: #FFC107;

.contacts{
  background: linear-gradient(to right, $dark-orange, $warning-variant);
  margin-top: 5rem;
  margin-bottom: 5rem;
  box-shadow: 0px 0px 10px 3.5px gray;
  h1{
    font-size: 20px;
  }
  .contact-icon {
    width: 90px;
  }
}

</style>
