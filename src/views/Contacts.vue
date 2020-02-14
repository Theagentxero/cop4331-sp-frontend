<template>
  <div>
    <Navbar />
    
    <AddContact />

    <ContactList />
  </div>
</template>

<script>
import Navbar from './Navbar.vue';
import AddContact from './AddContact.vue'
import ContactList from './ContactList.vue'

const axios = require('axios');
const uuidv4 = require('uuid/v4');
const jwt = require('jsonwebtoken');
const _ = require('underscore');
var sha256 = require('js-sha256');
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
      numRows: 10,
      numCols: 20,
    }
  },
  methods: {
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
