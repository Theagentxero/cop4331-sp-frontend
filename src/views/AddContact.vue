<template>
  <b-modal
    id="add-contact-modal"
    ok-variant="our-orange"
    ok-title="Add"
    cancel-variant="outline-danger"
    header-bg-variant="our-orange"
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

      <div v-for="phone, index in addContactSubmitForm.phoneNumbers">
        <b-row class="modal-phone-and-email" >
          <b-col cols="6">
            <b-form-group
              :label="(index == 0) ? 'Phone Number: ' : ''"
              label-for="phone-number-input"
            >
              <b-form-input
                id="phone-number-input"
                v-model="addContactSubmitForm.phoneNumbers[index].name"
              ></b-form-input>
            </b-form-group>
          </b-col>
          <b-col cols="5" :class="(index == 0) ? 'options-dropdown' : ''">
            <b-form-group id="input-group-1" label-for="input-1">
              <b-form-select
                id="input-1"
                v-model="addContactSubmitForm.phoneNumbers[index].value"
                :options="typeOptions"
                required
              ></b-form-select>
            </b-form-group>
          </b-col>
          <b-col cols="1" :class="(index == 0) ? 'plus-button' : 'plus-button-xtra'">
            <b-button class="add" size="sm" squared variant="our-orange" v-on:click="addPhoneNumber">+</b-button>
          </b-col>
        </b-row>
      </div>
      <div v-for="email, index in addContactSubmitForm.emails">
        <b-row class="modal-phone-and-email">
          <b-col cols="6">
            <b-form-group :label="(index == 0) ? 'Email: ' : ''" label-for="email-input">
              <b-form-input id="email-input" v-model="addContactSubmitForm.emails[index].name"></b-form-input>
            </b-form-group>
          </b-col>
          <b-col cols="5" :class="(index == 0) ? 'options-dropdown' : ''">
            <b-form-group id="input-group-2" label-for="input-2">
              <b-form-select
                id="input-2"
                v-model="addContactSubmitForm.emails[index].value"
                :options="typeOptions"
                required
              ></b-form-select>
            </b-form-group>
          </b-col>
          <b-col cols="1" :class="(index == 0) ? 'plus-button' : 'plus-button-xtra'">
            <b-button class="add" size="sm" squared variant="our-orange" v-on:click="addEmail">+</b-button>
          </b-col>
        </b-row>
      </div>
    </b-form>
  </b-modal>
</template>

<script>
const _ = require('underscore');

export default {
  name: "AddContact",
  data() {
    return {
      typeOptions: ["Home", "Work", "Personal"],
      addContactSubmitForm: {
        // userID: 'text' ==> This is the user that is logged in
        firstName: "",
        middleName: "",
        lastName: "",
        phoneNumbers: [
          {
            name: "",
            value: "Home"
          }
        ],
        emails: [
          {
            name: "",
            value: "Home"
          }
        ]
      }
    };
  },
  methods: {
    checkFormValidity() {
      // const valid = this.$refs.form.checkValidity()
      const valid = true;
      return valid;
    },
    resetModal() {
      this.addContactSubmitForm.firstName = "";
      this.addContactSubmitForm.middleName = "";
      this.addContactSubmitForm.lastName = "";
      this.addContactSubmitForm.phoneNumbers = [
        {
          name: "",
          value: "Home"
        }
      ];
      this.addContactSubmitForm.emails = [
        {
          name: "",
          value: "Home"
        }
      ];
    },
    handleOk(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault();
      // Trigger submit handler
      this.handleSubmit();
    },
    handleSubmit() {
      var payload = _.clone(this.addContactSubmitForm);
      // Blanks out value if no phone #/email exists
      payload.phoneNumbers = payload.phoneNumbers.filter(number => number.name != "");
      payload.emails = payload.emails.filter(email => email.name != "");
      // Exit when the form isn't valid
      if (!this.checkFormValidity()) {
        return;
      }
      console.log(payload)
      // Hide the modal manually
      this.$nextTick(() => {
        // Access by reference
        // this.$refs['add-contact-modal'].hide()

        // Acess by id
        this.$bvModal.hide("add-contact-modal");
      });
    },
    addPhoneNumber() {
      this.addContactSubmitForm.phoneNumbers.push({
        name: "",
        value: "Home"
      })
    },
    addEmail() {
      console.log('hi')
      this.addContactSubmitForm.emails.push({
        name: "",
        value: "Home"
      })
    }
  }
};
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