<template lang="pug">
b-container
  b-row
    b-col
      h3 Contact Info:
  b-row.reducePaddingNotMarin
    b-col(cols='3')
      b-row
        img.contact-icon(:src="'/img/contact/' + contact.id")
      b-row(v-if='editing')
        b-col
          form#imageUploadForm
            input#contactimg(type='file', name='contactimg', accept='image/png, image/jpeg, image/gif, image/tiff, image/bmp')
      b-row.text-center
        b-col.removePadding(cols='12', lg='4')
          b-button.buttons.mb-1(v-b-modal.modal-sm, type='delete', size='sm', variant='danger', v-on:click='deleteContact') Delete
        b-col.removePadding(cols='12', lg='4')
          b-button.buttons.mb-1(variant='our-orange', size='sm', v-on:click='startEdit') {{editButtonValue}}
        b-col.removePadding(cols='12', lg='4')
          b-button.buttons.mb-1(variant='our-orange', size='sm', v-if='notEditable', v-on:click='close') {{closeButtonValue}}
    b-col(cols='9', @ondblclick='startEdit()')
      //- Name Row
      b-row
        b-col(v-if='!editing')
          h3 Name: {{contact.formattedName()}}
        div(v-else)
          b-col(cols='12', md='6', lg='4')
            b-form-group#input-group-3(label-size='sm', label='First Name:', label-for='input-3')
              b-form-input#input-3.form-control(size='sm', v-model='contact.firstName', placeholder='Enter First Name', :disabled='notEditable')
          b-col(cols='12', md='6', lg='4')
            b-form-group#input-group-4(label-size='sm', label='Middle Name:', label-for='input-4')
              b-form-input#input-4(size='sm', v-model='contact.middleName', placeholder='Enter Middle Name', :disabled='notEditable')
          b-col(cols='12', md='12', lg='4')
            b-form-group#input-group-5(label-size='sm', label='Last Name:', label-for='input-5')
              b-form-input#input-5(size='sm', v-model='contact.lastName', placeholder='Enter Last Name', :disabled='notEditable')
      //- Phone Numbers Display
      div(v-if='!editing')
        b-row
          b-col(cols='1')
            //- Blank
          b-col(cols='11')
            h4 Phone:
        b-row(v-for='(phone, index) in contact.phoneNumbers', :key='index')
          //- Phone Number Name
          b-col(cols='2')
          //- Intentionally Blank
          b-col(cols='2')
            h4 {{phone.name}}
          b-col(cols='8')
            h4 {{phone.value}}
      //- Phone Numbers Edit
      div(v-else, v-for='email, index in contact.emails')
        b-row.modal-phone-and-email
          b-col(cols='5', sm='6', md='7')
            b-form-group(:label="(index == 0) ? 'Email(s): ' : ''", label-for='email-input')
              b-form-input#email-input(size='sm', v-model='email.value', :disabled='notEditable')
          b-col.dropDown(cols='5', :class="(index == 0) ? 'options-dropdown' : ''")
            b-row
              b-col(cols='11')
                b-form-group#input-group-2(label-for='input-2')
                  b-form-select#input-2.form-control(size='sm', v-model='email.name', :options='typeOptions', required='required')
              b-col.removePadding(cols='1')
                b-button.add(size='sm', squared='', variant='our-orange', v-on:click='addEmail($event, index, email)', v-text="(contact.emails.length-1) == index ? '+' : '-'")
      //- Emails Display
      div(v-if='!editing')
        b-row
          b-col(cols='1')
              //- Blank
          b-col(cols='11')
              h4 Email:
        b-row(v-for='(email, index) in contact.emails', :key='index')
          //- Phone Number Name
          b-col(cols='2')
          //- Intentionally Blank
          b-col(cols='2')
            h4 {{email.name}}
          b-col(cols='8')
            h4 {{email.value}}
      //- Emails Edit
      div(v-for='phone, index in contact.phoneNumbers')
        b-row.modal-phone-and-email
          b-col(cols='5', sm='6', md='7')
            b-form-group(:label="(index == 0) ? 'Phone Number(s): ' : ''", label-for='phone-number-input')
              b-form-input#phone-number-input(size='sm', v-model='phone.value', :formatter='phoneFormat')
          b-col.dropDown(cols='5', :class="(index == 0) ? 'options-dropdown phone-dropdown' : ''")
            b-row
              b-col(cols='11')
                b-form-group#input-group-1(label-for='input-1')
                  b-form-select#input-1.form-control(size='sm', v-model='phone.name', :options='typeOptions', required='required')
              b-col.removePadding(cols='1')
                b-button.add(size='sm', squared='', variant='our-orange', v-on:click='addPhoneNumber($event, index, phone)', v-text="(contact.phoneNumbers.length-1) == index ? '+' : '-'")
      b-modal#modal-sm(size='sm', cancel-variant='our-orange', cancel-title='Nevermind', ok-variant='danger', ok-title='Yes') Are you sure?
</template>
<script>
const _ = require('underscore');
const axios = require('axios');
const {Contact} = require('../lib/contactHandler.js');
const phoneNumberLib = require('../lib/phoneNumbers.js');

const instance = axios.create({
    timeout: 10000,
    headers: {'Content-Type': 'application/json'},
    withCredentials: true
});

const formData = axios.create({
    timeout: 10000,
    headers: {'Content-Type': 'multipart/form-data'},
    withCredentials: true
});

export default {
    name: "EditContact",
    props: {
        initContact: Contact
    },
    data() {
        return {
            editing: false,
            editButtonValue: "Edit",
            closeButtonValue: "Close",
            typeOptions: ["Home", "Work", "Personal"],
            notEditable: true,
            pageStatus: {
                waitingOnAPICall: false
            },
            contact: {},
            newPhone: {
                name: "",
                value: "",
            },
            newEmail: {
                name: "",
                value: "",
            },
            originalContact: {}
        }
    },
    methods: {
        startEdit(){
            if(this.editing){
                // Perform Save, Then Stop Editing
                this.updateContact();
            }else{
                this.editing = true;
                this.editButtonValue = "Save"
                this.closeButtonValue = "Discard"
            }
        },
        close(){
            if(this.editing){
                console.log("Discard Changes")
                // Stop Editing, and Discard Changes
                // Discard Changes
                this.contact = new Contact(this.originalContact);
                this.editing = false;
                this.editButtonValue = "Edit"
                this.closeButtonValue = "Close"
                
            }else{
                // Close Entire Item
                this.$emit('closeComponent')
            }
        },
        closeComponent(event) {
            event.preventDefault()
            this.$emit('closeComponent')
        },
        phoneFormat(input){
            return phoneNumberLib.format(input);
        },
        addPhone(event, index, phone){
          this.contact.addPhoneNumber(this.newPhone);
          this.newPhone = {
            name: "Home",
            value: "",
          };
        },
        addEmail(event){
            this.contact.addEmail(this.newEmail);
            this.newEmail = {
                name: "",
                value: "",
            };
        },
        removePhone(event, phone){
            console.log("Remove Phone");
            console.log(phone);
            this.contact.removePhoneNumber(phone.localID);
        },
        removeEmail(event, email){
            console.log("Remove Email");
            console.log(email);
            this.contact.removeEmail(email.localID);
        },
        updateContact() {
            this.pageStatus.waitingOnAPICall = true
            console.log(this.contact.dbPrep());
            var file = document.getElementById('contactimg');
            var fdata = new FormData();
            fdata.append("contactimg", file.files[0]);
            formData.post(`img/contact/${this.contact.id}`, fdata)
                .then(async (response) => {
                    this.triggerPhotoUpdate()
                })
                .catch((error) => {
                    // TODO: Handle Errors
                    console.log(error);
                });
            instance.put(`api/contacts/${this.contact.id}`, this.contact.dbPrep())
                .then(async (response) => {
                    console.log(response.data)
                    this.pageStatus.waitingOnAPICall = false
                    this.contact = new Contact(response.data.result);
                    this.$store.commit('updateContact', {contact: new Contact(response.data.result)});
                    this.originalContact = new Contact(response.data.result).dbPrep()
                    this.editing = false;
                    this.editButtonValue = "Edit"
                    this.closeButtonValue = "Close"
                })
                .catch((error) => {
                    this.pageStatus.waitingOnAPICall = false;
                    // TODO: Handle Errors
                    console.log(error);
                });
        },
        triggerPhotoUpdate(){
            var tmp = this.contact.id;
            this.contact.id = "123";
            this.$nextTick(()=>{
                this.contact.id = tmp;
            })
        },
        deleteContact(event) {
            this.pageStatus.waitingOnAPICall = true;
            instance.delete(`api/contacts/${this.contact.id}`)
                .then(async (response) => {
                    this.pageStatus.waitingOnAPICall = false;
                    this.$store.commit('deleteContact', {contact: this.contact.id});
                    this.$emit('closeComponent');
                })
                .catch((error) => {
                    this.pageStatus.waitingOnAPICall = false;
                    // TODO: Handle Errors
                    console.log(error);
                });
            
        },
        // editComponent(event) {
    //     event.preventDefault()
    //     this.notEditable = false
    //     this.contact = JSON.parse(JSON.stringify(this.unchangedContact))
    // },
    // cancelEdit(event) {
    //     event.preventDefault()
    //     this.notEditable = true
    //     this.contact = JSON.parse(JSON.stringify(this.unchangedContact))
    // },
    // closeComponent(event) {
    //   event.preventDefault()
    //   this.$emit('closeComponent')
    // },
    
    // addPhoneNumber(event, index) {
    //   event.preventDefault()
    //   if (this.notEditable) return
    //   if ((this.contact.phoneNumbers.length-1) == index)
    //     this.contact.phoneNumbers.push({
    //       name: "Home",
    //       value: ""
    //     })
    //   else
    //     this.contact.phoneNumbers.splice(index, 1)
    // },
    // addEmail(event, index) {
    //   event.preventDefault()
    //   if (this.notEditable) return
    //   if ((this.contact.emails.length-1) == index)
    //     this.contact.emails.push({
    //       name: "Home",
    //       value: ""
    //     })
    //   else
    //     this.contact.emails.splice(index, 1)
    // },
    // ran() {
    //   payload.phoneNumbers = payload.phoneNumbers.filter(number => number.value != "");
    //   payload.emails = payload.emails.filter(email => email.value != "");
    //   // Exit when the form isn't valid
    //   if (!this.checkFormValidity()) {
    //     return;
    //   }
    //   if (!this.isValidContact(payload)) {
    //     return;
    //   }
    // }
  },
    beforeMount() {
        this.originalContact = _.clone(this.initContact.dbPrep());
        this.contact = this.initContact;
        //console.log(this.contact);
        // if (this.contact.phoneNumbers.length == 0)
        //   this.contact.phoneNumbers.push({name: "Home", value: ""})
        // if (this.contact.emails.length == 0)
        //   this.contact.emails.push({name: "Home", value: ""})
        // this.unchangedContact = JSON.parse(JSON.stringify(this.contact))
    }
}
</script>

<style lang="scss" scoped>
    .card{
        background-color: #f69b28;
    }
    .contact-icon {
        width: 256px;
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
    .buttons {
        margin-right: 7px;
        background-color: white;
        color: #b36b00;
    }
</style>

<style scoped>
.loader,
.loader:before,
.loader:after {
  border-radius: 50%;
}
.loader {
  color: #ffffff;
  font-size: 11px;
  text-indent: -99999em;
  margin: 55px auto;
  position: relative;
  width: 10em;
  height: 10em;
  box-shadow: inset 0 0 0 1em;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
}
.loader:before,
.loader:after {
  position: absolute;
  content: '';
}
.loader:before {
  width: 5.2em;
  height: 10.2em;
  background: #0dc5c1;
  border-radius: 10.2em 0 0 10.2em;
  top: -0.1em;
  left: -0.1em;
  -webkit-transform-origin: 5.1em 5.1em;
  transform-origin: 5.1em 5.1em;
  -webkit-animation: load2 2s infinite ease 1.5s;
  animation: load2 2s infinite ease 1.5s;
}
.loader:after {
  width: 5.2em;
  height: 10.2em;
  background: #0dc5c1;
  border-radius: 0 10.2em 10.2em 0;
  top: -0.1em;
  left: 4.9em;
  -webkit-transform-origin: 0.1em 5.1em;
  transform-origin: 0.1em 5.1em;
  -webkit-animation: load2 2s infinite ease;
  animation: load2 2s infinite ease;
}
@-webkit-keyframes load2 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes load2 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
</style>