<template>
  <div>
    <Navbar @searchContacts='searchContacts'/>
    
    <AddContact />

    <ContactList :contactSections='contactSections'/>
  </div>
</template>

<script>
import Navbar from './Navbar.vue';
import AddContact from './AddContact.vue'
import ContactList from './ContactList.vue'

const _ = require('underscore');
const axios = require('axios');

const instance = axios.create({
    timeout: 10000,
    headers: {'Content-Type': 'application/json'},
    withCredentials: true
});

export default {
  name: 'Contacts',
  components: {
    Navbar,
    AddContact,
    ContactList
  },
  data() {
    return {
      contactSections: [],
      pageStatus: {
        waitingOnAPICall: false
      }
    }
  },
  methods: {
    fetchContacts() {
      this.pageStatus.waitingOnAPICall = true;
      instance.get('api/contacts', {})
      .then(async (response) => {
        this.pageStatus.waitingOnAPICall = false;
        this.$store.commit({type: 'loadContacts', amount: response.data.result})
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
    }
  },
  beforeMount() {
    this.fetchContacts();
  }
}
</script>

<style lang="scss" scoped>
.contacts{
  background-color: $warning-variant !important;
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
