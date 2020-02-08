<template>
  <b-col v-if="!selected" class="text-center" cols="6" sm="4" md="3" lg="2">
    <b-button variant="our-orange" :pressed.sync="selected">
      <img class="contact-icon mt-2" :src="'/img/contact/' + contact._id">
    </b-button>
    <h1 v-if="contact.firstName != ''">{{contact.firstName}}</h1>
    <h1 v-else-if="contact.middleName != ''">{{contact.middleName}}</h1>
    <h1 v-else-if="contact.lastName != ''">{{contact.lastName}}</h1>
    <h1 v-else-if="contact.phoneNumbers.length != 0">{{contact.phoneNumbers[0].value}}</h1>
    <h1 v-else-if="contact.emails.length != 0">{{contact.emails[0].value}}</h1>
    <h1 v-else>No Info</h1>
  </b-col>
  <b-col v-else cols="12">
    <EditContact @closeComponent="updateSelected" :contact="contact" />
  </b-col>
</template>

<script>
import EditContact from './EditContact.vue';

export default {
  name: 'ContactItem',
  components: {
    EditContact
  },
  data() {
    return {
      selected: false
    }
  },
  props: {
    contact: Object
  },
  methods: {
    updateSelected() {
      this.selected = false;
    }
  }
}
</script>

<style lang="scss" scoped>
.contact-icon {
  width: 90px;
}
h1 {
  font-size: 20px;
}
</style>