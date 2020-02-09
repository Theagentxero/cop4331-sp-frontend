<template>
<b-container>

              <h4>Kitty</h4>
              <b-card class="img-fluid" img-src="https://placekitten.com/300/300" img-left>
                <b-card-text>
                  <b-row>
                  <b-col>
                    <b-form-group label-size="sm"
                      id="input-group-1"
                      label="Email Address:"
                      label-for="input-1"
                    >
                      <b-form-input size="sm"
                        id="input-1"
                        v-model="contact.emails"
                        type="email"
                        placeholder="Enter email"
                        :disabled=true
                      ></b-form-input>
                    </b-form-group>
                </b-col>
              </b-row>

                <b-row>
                  <b-col cols="9">
                    <b-form-group label-size="sm"
                      id="input-group-3"
                      label="First Name:"
                      label-for="input-3">
                      <b-form-input size="sm"
                        id="input-3"
                        v-model="contact.firstName"
                        placeholder="Enter First Name"
                        :disabled=true
                      ></b-form-input>
                    </b-form-group>
                  </b-col>
                </b-row>

                <!-- Fourth Row -->
                <b-row>
                  <b-col cols="9">
                    <b-form-group label-size="sm"
                      id="input-group-4"
                      label="Middle Name:"
                      label-for="input-4">
                      <b-form-input size="sm"
                        id="input-4"
                        v-model="contact.middleName"
                        placeholder="Enter Middle Name"
                        :disabled=true
                      ></b-form-input>
                    </b-form-group>
                  </b-col>
                </b-row>

                <b-row>
                  <b-col cols="9">
                    <b-form-group label-size="sm"
                      id="input-group-4"
                      label="Middle Name:"
                      label-for="input-4">
                      <b-form-input size="sm"
                        id="input-4"
                        v-model="contact.middleName"
                        placeholder="Enter Middle Name"
                        :disabled=true
                      ></b-form-input>
                    </b-form-group>
                  </b-col>
                </b-row>

                <b-row>
                  <b-col cols="9">
                    <b-form-group label-size="sm"
                      id="input-group-4"
                      label="Middle Name:"
                      label-for="input-4">
                      <b-form-input size="sm"
                        id="input-4"
                        v-model="contact.middleName"
                        placeholder="Enter Middle Name"
                        :disabled=true
                      ></b-form-input>
                    </b-form-group>
                  </b-col>
                </b-row>

                <b-row>
                  <b-col cols="9">
                    <b-form-group label-size="sm"
                      id="input-group-4"
                      label="Middle Name:"
                      label-for="input-4">
                      <b-form-input size="sm"
                        id="input-4"
                        v-model="contact.middleName"
                        placeholder="Enter Middle Name"
                        :disabled=true
                      ></b-form-input>
                    </b-form-group>
                  </b-col>
                </b-row>

                <!-- Fifth Row -->
                <b-row>
                  <b-col cols="9">
                    <b-form-group label-size="sm"
                      id="input-group-5"
                      label="Last Name:"
                      label-for="input-5">
                      <b-form-input size="sm"
                        id="input-5"
                        v-model="contact.lastName"
                        placeholder="Enter Last Name"
                        :disabled=true
                      ></b-form-input>
                    </b-form-group>
                  </b-col>
                </b-row>

        </b-card-text>
        <b-button type="edit" size="sm" variant="warning" class="buttons">Edit</b-button>
        <b-button variant="warning" size="sm" class="buttons">Favorite</b-button>
        <b-button v-b-modal.modal-sm type="delete"  size="sm" variant="danger" class="buttons">Delete</b-button>
        <b-button type="ok" variant="warning" size="sm" class="buttons" v-on:click="closeFunction">OK</b-button>

        <b-modal
        id="modal-sm"
        size="sm"
        cancel-variant="our-orange"
        cancel-title="Nevermind"
        ok-variant="outline-danger"
        ok-title="Yes">
        Are you sure?
        </b-modal>

      </b-card>
  </b-col>
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

.card{
  background-color: #f69b28;
}

.contact-icon {
  width: 50px;
}

.buttons {
  margin-right: 7px;
  background-color: white;
  color: #b36b00;
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

  .card{
    background-color: #f69b28;
  }

  .contact-icon {
    width: 50px;
  }

  .buttons {
    margin-right: 7px;
    background-color: white;
    color: #b36b00;
}
</style>
