<template>
  <b-container>
    <hr style="border-top: 26px solid rgba(0, 0, 0, 15.1);">
    <b-form>
      <!-- First Row -->

      <div v-for="phone, index in contact.phoneNumbers">
        <b-row class="modal-phone-and-email" >
          <b-col cols="6">
            <b-form-group
              :label="(index == 0) ? 'Phone Number: ' : ''"
              label-for="phone-number-input"
            >
              <b-form-input
                id="phone-number-input"
                v-model="contact.phoneNumbers[index].value"
                :disabled="myToggle"
              ></b-form-input>
            </b-form-group>
          </b-col>
          <b-col cols="5" :class="(index == 0) ? 'options-dropdown' : ''">
            <b-form-group id="input-group-1" label-for="input-1">
              <b-form-select
                id="input-1"
                v-model="contact.phoneNumbers[index].name"
                :options="typeOptions"
                :disabled="myToggle"
                required
              ></b-form-select>
            </b-form-group>
          </b-col>
          <b-col cols="1" :class="(index == 0) ? 'plus-button' : 'plus-button-xtra'">
            <b-button class="add" size="sm" squared variant="our-orange" v-on:click="addPhoneNumber">+</b-button>
          </b-col>
        </b-row>
      </div>
      <!-- Second Row -->
      <div v-for="email, index in contact.emails">
        <b-row class="modal-phone-and-email" >
          <b-col cols="6">
            <b-form-group
              :label="(index == 0) ? 'Email: ' : ''"
              label-for="email-input"
            >
              <b-form-input
                id="email-input"
                v-model="contact.emails[index].value"
                :disabled="myToggle"
              ></b-form-input>
            </b-form-group>
          </b-col>
          <b-col cols="5" :class="(index == 0) ? 'options-dropdown' : ''">
            <b-form-group id="input-group-2" label-for="input-2">
              <b-form-select
                id="input-2"
                v-model="contact.emails[index].name"
                :options="typeOptions"
                :disabled="myToggle"
                required
              ></b-form-select>
            </b-form-group>
          </b-col>
          <b-col cols="1" :class="(index == 0) ? 'plus-button' : 'plus-button-xtra'">
            <b-button class="add" size="sm" squared variant="our-orange" v-on:click="addEmail">+</b-button>
          </b-col>
        </b-row>
      </div>

      <!-- Third Row -->
      <b-row>
        <b-col cols="6">
          <b-form-group
            id="input-group-3"
            label="First Name:"
            label-for="input-3">
            <b-form-input
              id="input-3"
              v-model="contact.firstName"
              placeholder="Enter First Name"
              :disabled="myToggle"
            ></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>

      <!-- Fourth Row -->
      <b-row>
        <b-col cols="4">
          <b-form-group
            id="input-group-4"
            label="Middle Name:"
            label-for="input-4">
            <b-form-input
              id="input-4"
              v-model="contact.middleName"
              placeholder="Enter Middle Name"
              :disabled="myToggle"
            ></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>

      <!-- Fifth Row -->
      <b-row>
        <b-col cols="2">
          <b-form-group
            id="input-group-5"
            label="Last Name:"
            label-for="input-5">
            <b-form-input
              id="input-5"
              v-model="contact.lastName"
              placeholder="Enter Last Name"
              :disabled="myToggle"
            ></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>

      <!-- Sixth Row -->
      <b-row>
        <b-col>
          <b-form-checkbox id="input-6" v-model="contact.favorite" :disabled="myToggle">Favorite Contact</b-form-checkbox>
        </b-col>
      </b-row>

      <b-row>
        <b-col>
          <b-button type="delete" variant="primary" v-on:click="deleteContact">Delete</b-button>
          <b-button type="edit" variant="danger" v-if="myToggle" v-on:click="editComponent">Edit</b-button>
          <b-button type="edit" variant="danger" v-else v-on:click="editComponent">Cancel</b-button>
          <b-button type="ok" variant="secondary" v-if="myToggle" v-on:click="closeComponent">OK</b-button>
          <b-button type="ok" variant="secondary" v-else v-on:click="updateContact">Save</b-button>
        </b-col>
      </b-row>
    </b-form>
    <b-card class="mt-3" header="Form Data Result">
      <pre class="m-0">{{ contact }}</pre>
    </b-card>
    <hr style="border-top: 26px solid rgba(0, 0, 0, 15.1);">
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
    contact: Object
  },
  data() {
    return {
      typeOptions: ["Home", "Work", "Personal"],
      myToggle: true,
      pageStatus: {
        waitingOnAPICall: false
      }
    }
  },
  methods: {
    editComponent(event) {
      event.preventDefault()
      this.myToggle = !this.myToggle
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
      this.pageStatus.waitingOnAPICall = true;
      instance.put(`api/contacts/${this.contact._id}`, this.contact)
      .then(async (response) => {
        this.pageStatus.waitingOnAPICall = false;
        this.$store.commit({type: 'updateContact', amount: this.contact})
      })
      .catch((error) => {
        this.pageStatus.waitingOnAPICall = false;
        // TODO: Handle Errors
        console.log(error);
      });
      this.$emit('closeComponent')
    },
    addPhoneNumber() {
      this.contact.phoneNumbers.push({
        name: "Home",
        value: ""
      })
    },
    addEmail() {
      this.contact.emails.push({
        name: "Home",
        value: ""
      })
    }
  },
  beforeMount() {
    if (this.contact.phoneNumbers.length == 0)
      this.contact.phoneNumbers.push({name: "Home", value: ""})
    if (this.contact.emails.length == 0)
      this.contact.emails.push({name: "Home", value: ""})
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