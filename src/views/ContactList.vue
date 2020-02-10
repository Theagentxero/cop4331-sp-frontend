<template>
  <div>
    <b-container class="contacts p-2">
      <b-row>
        <ContactItem v-for="contact in contactSections" :key="contact._id" :initContact="contact"/>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import ContactItem from './ContactItem.vue'

export default {
  name: "ContactList",
  components: {
    ContactItem
  },
  props: {
    contactSections: Array
  }
}
</script>

<style lang="scss" scoped>
.contacts {
  background-color: $warning-variant !important;
  margin-top: 5rem;
  margin-bottom: 5rem;
  box-shadow: 0px 0px 5px 3.5px rgba(232, 126, 4, 1);
}
</style>
