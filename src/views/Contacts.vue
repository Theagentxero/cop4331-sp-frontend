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
      }
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
        instance.get('api/contacts')
            .then(async (response) => {
                this.pageStatus.waitingOnAPICall = false;
                this.$store.commit('loadContacts', {contacts: response.data.result});
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
        this.contactSections = payload
    },
    delUpdate(){
        this.contactSections = this.$store.getters.getContacts;
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
