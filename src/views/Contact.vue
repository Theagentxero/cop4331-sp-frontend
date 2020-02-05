<template>
  <div>
    <div v-bind:key="contact.id" v-for="contact in contact">
    <ContactItem v-bind:contact="contact" v-on:delete-contact="$emit('delete-contact', contact-id)" />
  </div>
  </div>
</template>

<script>
import ContactItem from './ContactItem.vue';
export default {
  name: "Contact",
  components: {
    ContactItem
  },
  props: ["contact"]
}
</script>

<style scoped>
</style>
