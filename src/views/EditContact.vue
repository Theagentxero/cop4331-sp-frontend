<template lang="pug">
b-container
  hr(style='border-top: 26px solid rgba(0, 0, 0, 15.1);')
  b-form
    // First Name Row
    b-row
      b-col
        b-form-group#input-group-3(label='First Name:', label-for='input-3')
          b-form-input#input-3(v-model='contact.firstName', placeholder='Enter First Name', :disabled='notEditable')
    // Middle Name Row
    b-row
      b-col
        b-form-group#input-group-4(label='Middle Name:', label-for='input-4')
          b-form-input#input-4(v-model='contact.middleName', placeholder='Enter Middle Name', :disabled='notEditable')
    // Last Name Row
    b-row
      b-col
        b-form-group#input-group-5(label='Last Name:', label-for='input-5')
          b-form-input#input-5(v-model='contact.lastName', placeholder='Enter Last Name', :disabled='notEditable')
    // Phone Number Row
    div(v-for='phone, index in contact.phoneNumbers')
      b-row.modal-phone-and-email
        b-col(cols='6')
          b-form-group(:label="(index == 0) ? 'Phone Number(s): ' : ''", label-for='phone-number-input')
            b-form-input#phone-number-input(v-model='contact.phoneNumbers[index].value', :disabled='notEditable')
        b-col(cols='5', :class="(index == 0) ? 'options-dropdown' : ''")
          b-form-group#input-group-1(label-for='input-1')
            b-form-select#input-1(v-model='contact.phoneNumbers[index].name', :options='typeOptions', :disabled='notEditable', required)
        b-col(cols='1', :class="(index == 0) ? 'plus-button' : 'plus-button-xtra'")
          b-button.add(size='sm', squared='', variant='our-orange', v-on:click='addPhoneNumber($event, index)' v-text='(contact.phoneNumbers.length-1) == index ? "+" : "-"')
    // Email Row
    div(v-for='email, index in contact.emails')
      b-row.modal-phone-and-email
        b-col(cols='6')
          b-form-group(:label="(index == 0) ? 'Email(s): ' : ''", label-for='email-input')
            b-form-input#email-input(v-model='contact.emails[index].value', :disabled='notEditable')
        b-col(cols='5', :class="(index == 0) ? 'options-dropdown' : ''")
          b-form-group#input-group-2(label-for='input-2')
            b-form-select#input-2(v-model='contact.emails[index].name', :options='typeOptions', :disabled='notEditable', required)
        b-col(cols='1', :class="(index == 0) ? 'plus-button' : 'plus-button-xtra'")
          b-button.add(size='sm', squared='', variant='our-orange', v-on:click='addEmail' v-text='(contact.emails.length-1) == index ? "+" : "-"')
    // Favorite Contact Row
    b-row
      b-col
        b-form-checkbox#input-6(v-model='contact.favorite', :disabled='notEditable') Favorite Contact
    b-row
      b-col
        b-button(type='delete', variant='primary', v-on:click='deleteContact') Delete
        b-button(type='edit', variant='danger', v-if='notEditable', v-on:click='editComponent') Edit
        b-button(type='edit', variant='danger', v-else='', v-on:click='cancelEdit') Cancel
        b-button(type='ok', variant='secondary', v-if='notEditable', v-on:click='closeComponent') OK
        b-button(type='ok', variant='secondary', v-else='', v-on:click='updateContact') Save
  b-card.mt-3(header='Form Data Result')
    pre.m-0.
      {{ contact }}
  hr(style='border-top: 26px solid rgba(0, 0, 0, 15.1);')
</template>

<script>
const _ = require('underscore');
const axios = require('axios');

const instance = axios.create({
    timeout: 10000,
    headers: {'Content-Type': 'application/json'},
    withCredentials: true
});

export default {
  name: "EditContact",
  props: {
    initContact: Object
  },
  data() {
    return {
      typeOptions: ["Home", "Work", "Personal"],
      notEditable: true,
      pageStatus: {
        waitingOnAPICall: false
      },
      contact: JSON.parse(JSON.stringify(this.initContact)),
      unchangedContact: {}
    }
  },
  methods: {
    editComponent(event) {
      event.preventDefault()
      this.notEditable = false
      this.contact = JSON.parse(JSON.stringify(this.unchangedContact))
    },
    cancelEdit(event) {
      event.preventDefault()
      this.notEditable = true
      this.contact = JSON.parse(JSON.stringify(this.unchangedContact))
    },
    closeComponent(event) {
      event.preventDefault()
      this.$emit('closeComponent')
    },
    deleteContact(event) {
      event.preventDefault()
      this.pageStatus.waitingOnAPICall = true;
      instance.delete(`api/contacts/${this.contact._id}`)
      .then(async (response) => {
        this.pageStatus.waitingOnAPICall = false;
        this.$store.commit({type: 'deleteContact', amount: this.contact._id})
      })
      .catch((error) => {
        this.pageStatus.waitingOnAPICall = false;
        // TODO: Handle Errors
        console.log(error);
      });
      this.$emit('closeComponent')
    },
    updateContact(event) {
      event.preventDefault()
      this.pageStatus.waitingOnAPICall = true
      var payload = JSON.parse(JSON.stringify(this.contact))
      payload.phoneNumbers = payload.phoneNumbers.filter(number => number.value != "");
      payload.emails = payload.emails.filter(email => email.value != "");

      instance.put(`api/contacts/${payload._id}`, payload)
      .then(async (response) => {
        this.pageStatus.waitingOnAPICall = false
        this.$store.commit({type: 'updateContact', amount: payload})
        this.contact = JSON.parse(JSON.stringify(payload))
        if (this.contact.phoneNumbers.length == 0)
          this.contact.phoneNumbers.push({name: "Home", value: ""})
        if (this.contact.emails.length == 0)
          this.contact.emails.push({name: "Home", value: ""})
        this.unchangedContact = JSON.parse(JSON.stringify(this.contact))
        this.notEditable = true
      })
      .catch((error) => {
        this.pageStatus.waitingOnAPICall = false;
        // TODO: Handle Errors
        console.log(error);
      });
    },
    addPhoneNumber(event, index) {
      event.preventDefault()
      if (this.notEditable) return
      if ((this.contact.phoneNumbers.length-1) == index)
        this.contact.phoneNumbers.push({
          name: "Home",
          value: ""
        })
      else
        this.contact.phoneNumbers.splice(index, 1)
    },
    addEmail(event) {
      event.preventDefault()
      if (this.notEditable) return
      this.contact.emails.push({
        name: "Home",
        value: ""
      })
    },
    ran() {
      payload.phoneNumbers = payload.phoneNumbers.filter(number => number.value != "");
      payload.emails = payload.emails.filter(email => email.value != "");
      // Exit when the form isn't valid
      if (!this.checkFormValidity()) {
        return;
      }
      if (!this.isValidContact(payload)) {
        return;
      }
    }
  },
  beforeMount() {
    if (this.contact.phoneNumbers.length == 0)
      this.contact.phoneNumbers.push({name: "Home", value: ""})
    if (this.contact.emails.length == 0)
      this.contact.emails.push({name: "Home", value: ""})
    this.unchangedContact = JSON.parse(JSON.stringify(this.contact))
  }
}
</script>

<style lang="scss" scoped>
.options-dropdown {
  margin-top: 32px;
}
.plus-button {
  margin-top: 35px;
  padding-left: 0px;
}
.plus-button-xtra {
  margin-top: 4px;
  padding-left: 0px;
}
</style>