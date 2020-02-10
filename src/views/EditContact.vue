<template>
<b-container>
<h4 v-model="contact.firstName">Kitty</h4>
<b-row>
  <b-col cols="5"
    <img src="https://placekitten.com/300/300" class="img">
  </b-col>

  <b-col cols="2">
    <b-form-group label-size="sm"
      id="input-group-3"
      label="First Name:"
      label-for="input-3">
      <b-form-input size="sm" class="form-control"
        id="input-3"
        v-model="contact.firstName"
        placeholder="Enter First Name"
        :disabled="notEditable"
      ></b-form-input>
    </b-form-group>
  </b-col>

  <b-col cols="2">
    <b-form-group label-size="sm"
      id="input-group-4"
      label="Middle Name:"
      label-for="input-4">
      <b-form-input size="sm"
        id="input-4"
        v-model="contact.middleName"
        placeholder="Enter Middle Name"
        :disabled="notEditable"
      ></b-form-input>
    </b-form-group>
  </b-col>

  <b-col cols="2">
    <b-form-group label-size="sm"
      id="input-group-5"
      label="Last Name:"
      label-for="input-5">
      <b-form-input size="sm"
        id="input-5"
        v-model="contact.lastName"
        placeholder="Enter Last Name"
        :disabled="notEditable"
      ></b-form-input>
    </b-form-group>
  </b-col>
</b-row>

  <b-col cols="4">
    <b-button type="edit" size="sm" variant="our-orange" class="buttons" v-if="notEditable" v-on:click="editComponent">Edit</b-button>
    <b-button variant="our-orange" size="sm" class="buttons" v-else="" v-on:click="updateContact">Save</b-button>
    <b-button variant="our-orange" size="sm" class="buttons" v-model="contact.favorite" v-if="notEditable">Favorite</b-button>
    <b-button v-b-modal.modal-sm type="delete"  size="sm" variant="danger" class="buttons"
      v-else="" v-on:click="deleteContact">Delete
    </b-button>
    <b-button type="ok" variant="our-orange" size="sm" class="buttons" v-if="notEditable" v-on:click="closeComponent">OK</b-button>
    <b-button type="edit" variant="our-orange" size="sm" class="buttons" v-else="" v-on:click="cancelEdit">Cancel</b-button>
  </b-col>

  <b-modal
    id="modal-sm"
    size="sm"
    cancel-variant="our-orange"
    cancel-title="Nevermind"
    ok-variant="danger"
    ok-title="Yes">
    Are you sure?
  </b-modal>

  <div v-for="email, index in contact.emails">
  <b-row class="modal-phone-and-email">
    <b-col cols="4">
      <b-form-group :label="(index == 0) ? 'Email(s): ' : ''" label-for="email-input">
        <b-form-input size="sm" id="email-input" v-model="contact.emails[index].value" :disabled="notEditable"></b-form-input>
      </b-form-group>
    </b-col>
    <b-col cols="4" :class="(index == 0) ? 'options-dropdown' : ''">
      <b-form-group id="input-group-2" label-for="input-2">
        <b-form-select class="form-control" size="sm" id="input-2" v-model="contact.emails[index].name" :options="typeOptions" :disabled="notEditable" required="required"></b-form-select>
      </b-form-group>
    </b-col>
    <b-col cols="1" :class="(index == 0) ? 'plus-button' : 'plus-button-xtra'">
      <b-button size="sm" squared="" variant="our-orange" v-on:click="addEmail($event, index)" v-text="(contact.emails.length-1) == index ? '+' : '-'" class="add"></b-button>
    </b-col>
  </b-row>
  </div>

  <div v-for="phone, index in contact.phoneNumbers">
    <b-row class="modal-phone-and-email">
      <b-col cols="4">
        <b-form-group :label="(index == 0) ? 'Phone Number(s): ' : ''" label-for="phone-number-input">
          <b-form-input size="sm" id="phone-number-input" v-model="contact.phoneNumbers[index].value" :disabled="notEditable"></b-form-input>
        </b-form-group>
      </b-col>
      <b-col cols="4" :class="(index == 0) ? 'options-dropdown' : ''">
        <b-form-group id="input-group-1" label-for="input-1">
          <b-form-select class="form-control" size="sm" id="input-1" v-model="contact.phoneNumbers[index].name" :options="typeOptions" :disabled="notEditable" required="required"></b-form-select>
        </b-form-group>
      </b-col>
      <b-col cols="1" :class="(index == 0) ? 'plus-button' : 'plus-button-xtra'">
        <b-button size="sm" squared="" variant="our-orange" v-on:click="addPhoneNumber($event, index)" v-text="(contact.phoneNumbers.length-1) == index ? '+' : '-'" class="add"></b-button>
      </b-col>
    </b-row>
  </div>
</b-container>
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
    addEmail(event, index) {
      event.preventDefault()
      if (this.notEditable) return
      if ((this.contact.emails.length-1) == index)
        this.contact.emails.push({
          name: "Home",
          value: ""
        })
      else
        this.contact.emails.splice(index, 1)
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
  .btn.focus {
    box-shadow: 3px 0px 7px 1px #b36b00;
  }

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

  .buttons {
    margin-right: 7px;
    margin-bottom: 50px;
    background-color: #f69b29;
    color: #823905;
    box-shadow: 1px 0.8px 1px 1px #b36b00;
  }

  .img {
    height: 300px;
    margin-bottom: 8px;
    margin-left: 30px;
    margin-right: 15px;
    box-shadow: 2px 0px 7px 1px #b36b00;
  }

  .form-control:focus {
    border-color: white;
    box-shadow: 2px 2px 6px rgba(253, 227, 167, 1)
    inset, 1.5px 1.5px 2px rgba(249, 105, 14, 1);
    }
</style>
