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

export default {
  name: 'Contacts',
  components: {
    Navbar,
    AddContact,
    ContactList
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
