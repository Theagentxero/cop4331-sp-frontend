<template>
  <div class="">
    <!-- Navbar -->
    <b-navbar variant="warning" toggleable="lg">
      <!-- Navbar Brand -->
      <b-navbar-brand href="#">
        <img id="brand-icon" src="../assets/anonymous_crab_orange.png">
        Crabrr
      </b-navbar-brand>

      <!-- Navbar Toggle Button -->
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <!-- Collapsed Navbar Items -->
      <b-collapse id="nav-collapse" is-nav>
        <!-- Left Aligned Navbar Items -->
        <b-navbar-nav>
          <b-nav-item variant="warning">Favorite Crabs</b-nav-item>
          <b-nav-item v-b-modal.add-contact-modal variant="warning">Add A Crab</b-nav-item>
        </b-navbar-nav>
        <!-- Right Aligned Navbar Items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-form>
            <b-form-input size="sm" class="mr-sm-2" placeholder="Looking for crabbie..."></b-form-input>
            <b-button size="sm" class="my-2 my-sm-0" type="submit">Find Crab</b-button>
          </b-nav-form>
          <b-nav-item size="sm" variant="warning">Sign Out</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    
    <!-- Add Contact Modal -->
    <b-modal 
      id="add-contact-modal"
      ok-variant="warning" 
      ok-title="Add" 
      cancel-variant="outline-danger" 
      header-bg-variant="warning"
      ref="add-contact-modal"
      title="New Contact"
      @show="resetModal"
      @hidden="resetModal"
      @ok="handleOk"
    >
      <b-form ref="form" @submit.stop.prevent="handleSubmit">
        <b-form-group label="First Name:" label-for="first-name-input">
          <b-form-input id="first-name-input" v-model="addContactSubmitForm.firstName"></b-form-input>
        </b-form-group>

        <b-form-group label="Middle Name:" label-for="middle-name-input">
          <b-form-input id="middle-name-input" v-model="addContactSubmitForm.middleName"></b-form-input>
        </b-form-group>

        <b-form-group label="Last Name:" label-for="last-name-input">
          <b-form-input id="last-name-input" v-model="addContactSubmitForm.lastName"></b-form-input>
        </b-form-group>

        <template v-for="phone in phoneNumberQuantity">
          <b-row class="modal-phone-and-email" :key="phone">
            <b-col cols="6">
              <b-form-group :label="(phone == 1) ? 'Phone Number: ' : ''" label-for="phone-number-input">
                <b-form-input id="phone-number-input" v-model="addContactSubmitForm.phoneNumbers[0].name"></b-form-input>
              </b-form-group>
            </b-col>
            <b-col cols="5" :class="(phone == 1) ? 'options-dropdown' : ''">
              <b-form-group id="input-group-1" label-for="input-1">
                <b-form-select
                  id="input-1"
                  v-model="addContactSubmitForm.phoneNumbers[0].value"
                  :options="typeOptions"
                  required
                ></b-form-select>
              </b-form-group>
            </b-col>
            <b-col cols="1" :class="(phone == 1) ? 'plus-button' : 'plus-button-xtra'">
              <b-button class="add" size="sm" squared variant="warning"> + </b-button>
            </b-col>
          </b-row>
        </template>

        <template v-for="email in emailQuantity">
          <b-row class="modal-phone-and-email" :key="email">
            <b-col cols="6">
              <b-form-group :label="(email == 1) ? 'Email: ' : ''" label-for="email-input">
                <b-form-input id="email-input" v-model="addContactSubmitForm.emails[0].name"></b-form-input>
              </b-form-group>
            </b-col>
            <b-col cols="5" :class="(email == 1) ? 'options-dropdown' : ''">
              <b-form-group id="input-group-2" label-for="input-2">
                <b-form-select
                  id="input-2"
                  v-model="addContactSubmitForm.emails[0].value"
                  :options="typeOptions"
                  required
                ></b-form-select>
              </b-form-group>
            </b-col>
            <b-col cols="1" :class="(email == 1) ? 'plus-button' : 'plus-button-xtra'">
              <b-button class="add" size="sm" squared variant="warning"> + </b-button>
            </b-col>
          </b-row>
        </template>
      </b-form>
    </b-modal>

    <!-- List of Contacts -->
    <b-container v-for="row in numRows" :key="row" class="contacts p-2">
      <b-row>
        <b-col class="text-center" v-for="col in numCols" :key="col" cols="6" sm="4" md="3" lg="2">
          <img class="contact-icon mt-2" src="../assets/anonymous_crab_orange.png">
          <h1>Mr.Crabs</h1>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
const axios = require('axios');
const uuidv4 = require('uuid/v4');
const jwt = require('jsonwebtoken');
const _ = require('underscore');
var sha256 = require('js-sha256');

const instance = axios.create({
    timeout: 10000,
    headers: {'Content-Type': 'application/json'},
    withCredentials: true
});

export default {
  name: 'contacts',
  data() {
    return {
      numRows: 10,
      numCols: 20,
      phoneNumberQuantity: 3,
      emailQuantity: 4,
      typeOptions: ['Home', 'Work', 'Personal'],
      addContactSubmitForm: {
        // userID: 'text' ==> This is the user that is logged in
        firstName: '',
        middleName: '',
        lastName: '',
        phoneNumbers: [{
          name: '',
          value: 'Home'
        }],
        emails: [{
          name: '',
          value: 'Home'
        }]
      }
    }
  },
  methods: {
    checkFormValidity() {
      // const valid = this.$refs.form.checkValidity()
      const valid = true;
      return valid
    },
    resetModal() {
      this.addContactSubmitForm.firstName = ''
      this.addContactSubmitForm.middleName = ''
      this.addContactSubmitForm.lastName = ''
      this.addContactSubmitForm.phoneNumbers = [{
        name: '',
        value: 'Home'
      }]
      this.addContactSubmitForm.emails = [{
        name: '',
        value: 'Home'
      }]
    },
    handleOk(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault()
      // Trigger submit handler
      this.handleSubmit()
    },
    handleSubmit() {
      var payload = _.clone(this.addContactSubmitForm);
      // Blanks out value if no phone #/email exists
      payload.phoneNumbers = payload.phoneNumbers.filter(number => number.name != '')
      payload.emails = payload.emails.filter(email => email.name != '')

      // Exit when the form isn't valid
      if (!this.checkFormValidity()) {
        return
      }

      // Hide the modal manually
      this.$nextTick(() => {
        // Access by reference
        // this.$refs['add-contact-modal'].hide()
        
        // Acess by id
        this.$bvModal.hide('add-contact-modal')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
$warning-variant: #ffc107;

#brand-icon {
  width: 60px;
}

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
.modal-phone-and-email {
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
}
</style>
