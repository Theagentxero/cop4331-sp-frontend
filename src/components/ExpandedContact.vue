<template>
    <b-container>
        <b-row>
            <b-col cols="4">
                <b-row>
                    <b-col>
                        <img :src="'/img/contact/' + contact.id" class="contact-icon"/>
                    </b-col>
                </b-row>
                <b-row v-if="editing">
                    <b-col>
                        <!-- Upload Image Here -->
                        <form id="imageUploadForm">
                           <input type="file" id="contactimg" name="contactimg" accept="image/png, image/jpeg, image/gif, image/tiff, image/bmp">
                        </form>
                    </b-col>
                </b-row>
            </b-col>
            <b-col cols="8" @ondblclick="startEdit()">
                <!-- Name Row -->
                <b-row>
                    <b-col v-if="!editing">
                        <h3>Name: {{contact.formattedName()}}</h3>
                    </b-col>
                    <b-col v-else>
                        <b-form>
                            <b-row>
                                <b-col cols="2">
                                    <h3>Name:</h3>
                                </b-col>
                                <b-col>
                                    <b-form-group
                                        id="first-name-group"
                                        description="First Name"
                                        label-for="input-first-name"
                                    >
                                        <b-form-input 
                                            id="input-first-name" 
                                            v-model="contact.firstName"
                                        ></b-form-input>
                                    </b-form-group>
                                </b-col>
                                <b-col>
                                    <b-form-group
                                        id="middle-name-group"
                                        description="Middle Name"
                                        label-for="input-middle-name"
                                    >
                                        <b-form-input 
                                            id="input-middle-name" 
                                            v-model="contact.middleName"
                                        ></b-form-input>
                                    </b-form-group>
                                </b-col>
                                <b-col>
                                    <b-form-group
                                        id="last-name-group"
                                        description="Last Name"
                                        label-for="input-last-name"
                                    >
                                        <b-form-input 
                                            id="input-last-name" 
                                            v-model="contact.lastName"
                                        ></b-form-input>
                                    </b-form-group>
                                </b-col>  
                            </b-row>
                        </b-form>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col>
                        <b-row>
                            <b-col>
                                <h3>Contact Info:</h3>
                            </b-col>
                        </b-row>
                        <!-- Phone Numbers Rows -->
                        <b-row>
                            <b-col cols="1">
                                <!-- Blank -->
                            </b-col>
                            <b-col cols="11">
                                <h4>Phone:</h4>
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col v-if="!editing">
                                <b-row v-for="(phone, index) in contact.phoneNumbers" :key="index">
                                    <!-- Phone Number Name -->
                                    <b-col cols="2">
                                        <!-- Intentionally Blank -->
                                    </b-col>
                                    <b-col cols="2">
                                        <h4>{{phone.name}}</h4>
                                    </b-col>
                                    <b-col cols="8">
                                        <h4>{{phone.value}}</h4>
                                    </b-col>
                                </b-row>
                            </b-col>
                            <b-col v-else>
                                <b-row v-for="(phone, index) in contact.phoneNumbers" :key="index">
                                    <!-- Phone Number Name -->
                                    <b-col cols="2">
                                        <!-- Intentionally Blank -->
                                    </b-col>
                                    <b-col cols="2">
                                        <b-form-group
                                            :id="'group-phone-name-' + index"
                                            description="Name"
                                            :label-for="'input-phone-name-' + index"
                                        >
                                            <b-form-input 
                                                :id="'input-phone-name-' + index"
                                                type="text"
                                                v-model="phone.name"
                                            ></b-form-input>
                                        </b-form-group>
                                    </b-col>
                                    <b-col cols="7">
                                        <b-form-group
                                            :id="'group-phone-value-' + index"
                                            description="Phone Number"
                                            :label-for="'input-phone-value-' + index"
                                        >
                                            <b-form-input 
                                                :id="'input-phone-value-' + index" 
                                                v-model="phone.value"
                                                :formatter="phoneFormat"
                                            ></b-form-input>
                                        </b-form-group>
                                    </b-col>
                                    <b-col>
                                        <b-button 
                                            class="add" 
                                            size="sm" 
                                            squared 
                                            variant="our-orange-invert" 
                                            v-on:click="removePhone($event, phone)" 
                                            v-text="'-'"
                                        ></b-button>
                                    </b-col>
                                </b-row>
                                <b-row>
                                    <!-- Phone Number Name -->
                                    <b-col cols="2">
                                        <!-- Intentionally Blank -->
                                    </b-col>
                                    <b-col cols="2">
                                        <b-form-group
                                            :id="'group-phone-name-new'"
                                            description="Name"
                                            :label-for="'input-phone-name-new'"
                                        >
                                            <b-form-input 
                                                :id="'input-phone-name-new'"
                                                placeholder="Add Phone Number" 
                                                type="text"
                                                v-model="newPhone.name"
                                            ></b-form-input>
                                        </b-form-group>
                                    </b-col>
                                    <b-col cols="7">
                                        <b-form-group
                                            :id="'group-phone-value-new'"
                                            description="New Phone Number"
                                            :label-for="'input-phone-value-new'"
                                        >
                                            <b-form-input 
                                                :id="'input-phone-value-new'"
                                                placeholder="Add Phone Number" 
                                                v-model="newPhone.value"
                                                :formatter="phoneFormat"
                                            ></b-form-input>
                                        </b-form-group>
                                    </b-col>
                                    <b-col>
                                        <b-button 
                                            class="add" 
                                            size="sm" 
                                            squared 
                                            variant="our-orange-invert" 
                                            v-on:click="addPhone($event)" 
                                            v-text="'+'"
                                        ></b-button>
                                    </b-col>
                                </b-row>
                            </b-col>
                        </b-row>
                        
                        <!-- Email Rows -->
                        <b-row>
                            <b-col cols="1">
                                <!-- Blank -->
                            </b-col>
                            <b-col cols="11">
                                <h4>Email:</h4>
                            </b-col>
                        </b-row>
                        <b-row>
                            
                        </b-row>
                            <b-col v-if="!editing">
                                <!-- Email Row -->
                                <b-row v-for="(email, index) in contact.emails" :key="index">
                                    <!-- Phone Number Name -->
                                    <b-col cols="2">
                                        <!-- Intentionally Blank -->
                                    </b-col>
                                    <b-col cols="2">
                                        <h4>{{email.name}}</h4>
                                    </b-col>
                                    <b-col cols="8">
                                        <h4>{{email.value}}</h4>
                                    </b-col>
                                </b-row>
                            </b-col>
                            <b-col v-else>
                                <b-row v-for="(email, index) in contact.emails" :key="index">
                                    <!-- Phone Number Name -->
                                    <b-col cols="2">
                                        <!-- Intentionally Blank -->
                                    </b-col>
                                    <b-col cols="2">
                                        <b-form-group
                                            :id="'group-email-name-' + index"
                                            description="Name"
                                            :label-for="'input-phone-name-' + index"
                                        >
                                            <b-form-input 
                                                :id="'input-email-name-' + index"
                                                type="text"
                                                v-model="email.name"
                                            ></b-form-input>
                                        </b-form-group>
                                    </b-col>
                                    <b-col cols="7">
                                        <b-form-group
                                            :id="'group-email-value-' + index"
                                            description="Phone Number"
                                            :label-for="'input-phone-value-' + index"
                                        >
                                            <b-form-input 
                                                :id="'input-email-value-' + index" 
                                                v-model="email.value"
                                            ></b-form-input>
                                        </b-form-group>
                                    </b-col>
                                    <b-col>
                                        <b-button 
                                            class="add" 
                                            size="sm" 
                                            squared 
                                            variant="our-orange-invert" 
                                            v-on:click="removeEmail($event, email)" 
                                            v-text="'-'"
                                        ></b-button>
                                    </b-col>
                                </b-row>
                                <b-row>
                                    <!-- Phone Number Name -->
                                    <b-col cols="2">
                                        <!-- Intentionally Blank -->
                                    </b-col>
                                    <b-col cols="2">
                                        <b-form-group
                                            :id="'group-email-name-new'"
                                            description="Name"
                                            :label-for="'input-email-name-new'"
                                        >
                                            <b-form-input 
                                                :id="'input-email-name-new'"
                                                placeholder="New Email" 
                                                type="text"
                                                v-model="newEmail.name"
                                            ></b-form-input>
                                        </b-form-group>
                                    </b-col>
                                    <b-col cols="7">
                                        <b-form-group
                                            :id="'group-email-value-new'"
                                            description="New Email"
                                            :label-for="'input-email-value-new'"
                                        >
                                            <b-form-input 
                                                :id="'input-email-value-new'"
                                                placeholder="New Email" 
                                                v-model="newEmail.value"
                                            ></b-form-input>
                                        </b-form-group>
                                    </b-col>
                                    <b-col>
                                        <b-button 
                                            class="add" 
                                            size="sm" 
                                            squared 
                                            variant="our-orange-invert" 
                                            v-on:click="addEmail($event)" 
                                            v-text="'+'"
                                        ></b-button>
                                    </b-col>
                                </b-row>
                            </b-col>
                    </b-col>
                    
                </b-row>
            </b-col>
        </b-row>
        <b-row>
            <b-col cols="10">

            </b-col>
            <b-col cols="2">
                <b-button-group>
                    <b-button v-if="pageStatus.waitingOnAPICall"><div class="loader"></div></b-button>
                    <b-button v-if="!pageStatus.waitingOnAPICall" variant="danger" @click="deleteContact()">Delete</b-button>
                    <b-button v-if="!pageStatus.waitingOnAPICall" variant="info" @click="startEdit()">{{editButtonValue}}</b-button>
                    <b-button v-if="!pageStatus.waitingOnAPICall" variant="warning" @click="close()" >{{closeButtonValue}}</b-button>
                </b-button-group>
            </b-col>
        </b-row>
        
    </b-container>
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
        addPhone(event){
            this.contact.addPhoneNumber(this.newPhone);
            this.newPhone = {
                name: "",
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