<template lang="pug">
b-container
  h4(v-model='contact.firstName') Kitty
  b-row.reducePaddingNotMarin
    b-col(cols='3')
      b-row
        img.img-fluid(src='https://placekitten.com/300/300')
      b-row.text-center
        b-col.removePadding(cols='12', lg='4')
          b-button.buttons.mb-1(type='edit', size='sm', variant='our-orange', v-if='notEditable', v-on:click='editComponent') Edit
          b-button.buttons.mb-1(variant='our-orange', size='sm', v-else='', v-on:click='updateContact') Save
        b-col.removePadding(cols='12', lg='4')
          b-button.buttons.mb-1(variant='our-orange', size='sm', v-model='contact.favorite', v-if='notEditable') Favorite
          b-button.buttons.mb-1(v-b-modal.modal-sm='', type='delete', size='sm', variant='danger', v-else='', v-on:click='deleteContact') Delete
        b-col.removePadding(cols='12', lg='4')
          b-button.buttons.mb-1(type='ok', variant='our-orange', size='sm', v-if='notEditable', v-on:click='closeComponent') OK
          b-button.buttons.mb-1(type='edit', variant='our-orange', size='sm', v-else='', v-on:click='cancelEdit') Cancel
    b-col(cols='9')
      b-row
        b-col(cols='12', md='6', lg='4')
          b-form-group#input-group-3(label-size='sm', label='First Name:', label-for='input-3')
            b-form-input#input-3.form-control(size='sm', v-model='contact.firstName', placeholder='Enter First Name', :disabled='notEditable')
        b-col(cols='12', md='6', lg='4')
          b-form-group#input-group-4(label-size='sm', label='Middle Name:', label-for='input-4')
            b-form-input#input-4(size='sm', v-model='contact.middleName', placeholder='Enter Middle Name', :disabled='notEditable')
        b-col(cols='12', md='12', lg='4')
          b-form-group#input-group-5(label-size='sm', label='Last Name:', label-for='input-5')
            b-form-input#input-5(size='sm', v-model='contact.lastName', placeholder='Enter Last Name', :disabled='notEditable')
      div(v-for='email, index in contact.emails')
        b-row.modal-phone-and-email
          b-col(cols='5', sm='6', md='7')
            b-form-group(:label="(index == 0) ? 'Email(s): ' : ''", label-for='email-input')
              b-form-input#email-input(size='sm', v-model='contact.emails[index].value', :disabled='notEditable')
          b-col.dropDown(cols='5', :class="(index == 0) ? 'options-dropdown' : ''")
            b-row
              b-col(cols='11')
                b-form-group#input-group-2(label-for='input-2')
                  b-form-select#input-2.form-control(size='sm', v-model='contact.emails[index].name', :options='typeOptions', :disabled='notEditable', required='required')
              b-col.removePadding(cols='1')
                b-button.add(size='sm', squared='', variant='our-orange', v-on:click='addEmail($event, index)', v-text="(contact.emails.length-1) == index ? '+' : '-'")
      div(v-for='phone, index in contact.phoneNumbers')
        b-row.modal-phone-and-email
          b-col(cols='5', sm='6', md='7')
            b-form-group(:label="(index == 0) ? 'Phone Number(s): ' : ''", label-for='phone-number-input')
              b-form-input#phone-number-input(size='sm', v-model='contact.phoneNumbers[index].value', :disabled='notEditable')
          b-col.dropDown(cols='5', :class="(index == 0) ? 'options-dropdown phone-dropdown' : ''")
            b-row
              b-col(cols='11')
                b-form-group#input-group-1(label-for='input-1')
                  b-form-select#input-1.form-control(size='sm', v-model='contact.phoneNumbers[index].name', :options='typeOptions', :disabled='notEditable', required='required')
              b-col.removePadding(cols='1')
                b-button.add(size='sm', squared='', variant='our-orange', v-on:click='addPhoneNumber($event, index)', v-text="(contact.phoneNumbers.length-1) == index ? '+' : '-'")
</template>

<script>
const _ = require("underscore");
const axios = require("axios");

const instance = axios.create({
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
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
    };
  },
  methods: {
    editComponent(event) {
      event.preventDefault();
      this.notEditable = false;
      this.contact = JSON.parse(JSON.stringify(this.unchangedContact));
    },
    cancelEdit(event) {
      event.preventDefault();
      this.notEditable = true;
      this.contact = JSON.parse(JSON.stringify(this.unchangedContact));
    },
    closeComponent(event) {
      event.preventDefault();
      this.$emit("closeComponent");
    },
    deleteContact(event) {
      event.preventDefault();
      this.pageStatus.waitingOnAPICall = true;
      instance
        .delete(`api/contacts/${this.contact._id}`)
        .then(async response => {
          this.pageStatus.waitingOnAPICall = false;
          this.$store.commit({
            type: "deleteContact",
            amount: this.contact._id
          });
        })
        .catch(error => {
          this.pageStatus.waitingOnAPICall = false;
          // TODO: Handle Errors
          console.log(error);
        });
      this.$emit("closeComponent");
    },
    updateContact(event) {
      event.preventDefault();
      this.pageStatus.waitingOnAPICall = true;
      var payload = JSON.parse(JSON.stringify(this.contact));
      payload.phoneNumbers = payload.phoneNumbers.filter(number => number.value != "");
      payload.emails = payload.emails.filter(email => email.value != "");

      instance
        .put(`api/contacts/${payload._id}`, payload)
        .then(async response => {
          this.pageStatus.waitingOnAPICall = false;
          this.$store.commit({ type: "updateContact", amount: payload });
          this.contact = JSON.parse(JSON.stringify(payload));
          if (this.contact.phoneNumbers.length == 0)
            this.contact.phoneNumbers.push({ name: "Home", value: "" });
          if (this.contact.emails.length == 0)
            this.contact.emails.push({ name: "Home", value: "" });
          this.unchangedContact = JSON.parse(JSON.stringify(this.contact));
          this.notEditable = true;
        })
        .catch(error => {
          this.pageStatus.waitingOnAPICall = false;
          // TODO: Handle Errors
          console.log(error);
        });
    },
    addPhoneNumber(event, index) {
      event.preventDefault();
      if (this.notEditable) return;
      if (this.contact.phoneNumbers.length - 1 == index)
        this.contact.phoneNumbers.push({
          name: "Home",
          value: ""
        });
      else this.contact.phoneNumbers.splice(index, 1);
    },
    addEmail(event, index) {
      event.preventDefault();
      if (this.notEditable) return;
      if (this.contact.emails.length - 1 == index)
        this.contact.emails.push({
          name: "Home",
          value: ""
        });
      else this.contact.emails.splice(index, 1);
    }
  },
  beforeMount() {
    if (this.contact.phoneNumbers.length == 0)
      this.contact.phoneNumbers.push({ name: "Home", value: "" });
    if (this.contact.emails.length == 0)
      this.contact.emails.push({ name: "Home", value: "" });
    this.unchangedContact = JSON.parse(JSON.stringify(this.contact));
  }
};
</script>

<style lang="scss" scoped>

.options-dropdown {
  margin-top: 32px;
  @media (max-width: 530px) {
    padding-left: 0px;
  }
}

.phone-dropdown {
  @media (max-width: 530px) {
    margin-top: 56px;
  }
}

.dropDown {
  padding-left: 0px;
}

.buttons {
  box-shadow: 1px 0.8px 1px 1px #b36b00;
}

.removePadding {
  padding-left: 0px;
  padding-right: 0px;
}

.form-control:focus {
  border-color: white;
  box-shadow: 2px 2px 6px rgba(253, 227, 167, 1) inset,
    1.5px 1.5px 2px rgba(249, 105, 14, 1);
}
</style>
