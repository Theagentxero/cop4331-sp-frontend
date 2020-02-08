<template lang="pug">
b-col.text-center(v-if='!selected', cols='6', sm='4', md='3', lg='2')
  b-button(variant='our-orange', :pressed.sync='selected')
    img.contact-icon.mt-2(:src="'/img/contact/' + contact._id")
  h1(v-if="contact.firstName != ''") {{contact.firstName}}
  h1(v-else-if="contact.middleName != ''") {{contact.middleName}}
  h1(v-else-if="contact.lastName != ''") {{contact.lastName}}
  h1(v-else-if='contact.phoneNumbers.length != 0') {{contact.phoneNumbers[0].value}}
  h1(v-else-if='contact.emails.length != 0') {{contact.emails[0].value}}
  h1(v-else='') No Info
b-col(v-else='', cols='12')
  EditContact(@closeComponent='updateSelected', :initContact='contact')
</template>

<script>
import EditContact from './EditContact.vue';

export default {
  name: 'ContactItem',
  components: {
    EditContact
  },
  props: {
    initContact: Object
  },
  data() {
    return {
      selected: false,
      contact: JSON.parse(JSON.stringify(this.initContact))
    }
  },
  methods: {
    updateSelected() {
      this.selected = false;
      this.contact = JSON.parse(JSON.stringify(this.$store.getters.getByID(this.initContact._id)))
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