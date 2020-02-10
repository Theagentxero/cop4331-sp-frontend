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
    @ok="handleOk"
>
    <b-form ref="form" @submit.stop.prevent="handleSubmit">
        <b-form-group label="First Name:" label-for="first-name-input">
            <b-form-input id="first-name-input" v-model="newContact.firstName"></b-form-input>
        </b-form-group>

        <b-form-group label="Middle Name:" label-for="middle-name-input">
            <b-form-input id="middle-name-input" v-model="newContact.middleName"></b-form-input>
        </b-form-group>

        <b-form-group label="Last Name:" label-for="last-name-input">
            <b-form-input id="last-name-input" v-model="newContact.lastName"></b-form-input>
        </b-form-group>
        
        <b-form-group
            :label="phoneNumbersLabel()"
            label-size="lg"
            label-class="font-weight-bold pt-0"
            class="mb-0"
        >
            <b-row class="modal-phone-and-email" v-for="(phone, index) in newContact.phoneNumbers" :key="index">
                <b-col cols="5">
                    <b-form-select
                        id="input-1"
                        v-model="newContact.phoneNumbers[index].name"
                        :options="typeOptions"
                        required
                    ></b-form-select>
                </b-col>
                <b-col cols="6">
                    <b-form-input
                        id="phone-number-input"
                        v-model="newContact.phoneNumbers[index].value"
                    ></b-form-input>
                </b-col>
                <b-col cols="1" :class="(index == 0) ? 'plus-button' : 'plus-button-xtra'">
                    <b-button 
                        class="add" 
                        size="sm" 
                        squared 
                        variant="our-orange" 
                        v-on:click="addPhoneNumber($event, index)" 
                        v-text="(newContact.phoneNumbers.length-1) == index ? '+' : '-'"
                    ></b-button>
                </b-col>
            </b-row>
        </b-form-group>
        <b-form-group
            :label="emailsLabel()"
            label-size="lg"
            label-class="font-weight-bold pt-0"
            class="mb-0"
        >
            <b-row class="modal-phone-and-email" v-for="(email, index) in newContact.emails" :key="index">
                <b-col cols="5">
                    <b-form-select
                        id="input-1"
                        v-model="newContact.emails[index].name"
                        :options="typeOptions"
                        required
                    ></b-form-select>
                </b-col>
                <b-col cols="6">
                    <b-form-input
                        id="phone-number-input"
                        v-model="newContact.emails[index].value"
                    ></b-form-input>
                </b-col>
                <b-col cols="1" :class="(index == 0) ? 'plus-button' : 'plus-button-xtra'">
                    <b-button 
                        class="add" 
                        size="sm" 
                        squared variant="our-orange" 
                        v-on:click="addEmail($event, index)" 
                        v-text="(addContactSubmitForm.emails.length-1) == index ? '+' : '-'"
                    ></b-button>
                </b-col>
            </b-row>
        </b-form-group>


        <!-- <div v-for="phone, index in addContactSubmitForm.phoneNumbers">
            <b-row class="modal-phone-and-email">
                <b-col cols="6">
                    <b-form-group
                        :label="(index == 0) ? 'Phone Number: ' : ''"
                        label-for="phone-number-input"
                    >
                        <b-form-input
                            id="phone-number-input"
                            v-model="newContact.phoneNumbers[index].value"
                        ></b-form-input>
                    </b-form-group>
                </b-col>
                <b-col cols="5" :class="(index == 0) ? 'options-dropdown' : ''">
                <b-form-group id="input-group-1" label-for="input-1">
                    <b-form-select
                        id="input-1"
                        v-model="newContact.phoneNumbers[index].name"
                        :options="typeOptions"
                        required
                    ></b-form-select>
                </b-form-group>
                </b-col>
                <b-col cols="1" :class="(index == 0) ? 'plus-button' : 'plus-button-xtra'">
                    <b-button class="add" size="sm" squared variant="our-orange" v-on:click="addPhoneNumber($event, index)" v-text="(addContactSubmitForm.phoneNumbers.length-1) == index ? '+' : '-'"></b-button>
                </b-col>
            </b-row>
        </div>
        <div v-for="email, index in addContactSubmitForm.emails">
            <b-row class="modal-phone-and-email">
            <b-col cols="6">
                <b-form-group :label="(index == 0) ? 'Email: ' : ''" label-for="email-input">
                <b-form-input id="email-input" v-model="contact.emails[index].value"></b-form-input>
                </b-form-group>
            </b-col>
            <b-col cols="5" :class="(index == 0) ? 'options-dropdown' : ''">
                <b-form-group id="input-group-2" label-for="input-2">
                <b-form-select
                    id="input-2"
                    v-model="contact.emails[index].name"
                    :options="typeOptions"
                    required
                ></b-form-select>
                </b-form-group>
            </b-col>
            <b-col cols="1" :class="(index == 0) ? 'plus-button' : 'plus-button-xtra'">
                <b-button class="add" size="sm" squared variant="our-orange" v-on:click="addEmail($event, index)" v-text="(addContactSubmitForm.emails.length-1) == index ? '+' : '-'"></b-button>
            </b-col>
            </b-row>
        </div> -->

    </b-form>
</b-modal>
</template>

<script>
const _ = require('underscore');
const axios = require('axios');
const {Contact} = require('../lib/contactHandler.js');
const phoneLib = require('../lib/phoneNumbers.js');

const instance = axios.create({
    timeout: 10000,
    headers: {'Content-Type': 'application/json'},
    withCredentials: true
});

export default {
    name: "AddContact",
    data() {
        return {
            pageStatus: {
                waitingOnAPICall: false
            },
            typeOptions: ["Home", "Work", "Personal"],
            contact: {},
            newContact: {
                firstName: "",
                middleName: "",
                lastName: "",
                phoneNumbers: [
                    {name: "Cell", value: ""},
                ],
                emails: [
                    {name: "Personal", value: ""},
                ]
            },
            addContactSubmitForm: {
                // userID: 'text' ==> This is the user that is logged in
                firstName: "",
                middleName: "",
                lastName: "",
                phoneNumbers: [
                {
                    name: "Home",
                    value: ""
                }
                ],
                emails: [
                {
                    name: "Home",
                    value: ""
                }
                ]
            },
        
        };
    },
    methods: {
        checkFormValidity() {
        // const valid = this.$refs.form.checkValidity()
        const valid = true;
        return valid;
        },
        phoneNumbersLabel(){
            if(this.newContact.phoneNumbers.length > 1){
                return "Phone Numbers:";
            }else{
                return "Phone Number:";
            }
        },
        emailsLabel(){
            if(this.newContact.emails.length > 1){
                return "Emails:";
            }else{
                return "Email:";
            }
        },
        resetModal() {
            this.newContact = {
                firstName: "",
                middleName: "",
                lastName: "",
                phoneNumbers: [
                    {name: "", value: ""},
                ],
                emails: [
                    {name: "", value: ""},
                ]
            };
            //   this.addContactSubmitForm.firstName = "";
            //   this.addContactSubmitForm.middleName = "";
            //   this.addContactSubmitForm.lastName = "";
            //   this.addContactSubmitForm.phoneNumbers = [
            //     {
            //       name: "Home",
            //       value: ""
            //     }
            //   ];
            //   this.addContactSubmitForm.emails = [
            //     {
            //       name: "Home",
            //       value: ""
            //     }
            //   ];
        },
        handleOk(bvModalEvt) {
            // Prevent modal from closing
            bvModalEvt.preventDefault();
            // Trigger submit handler
            this.handleSubmit();
        },
        handleSubmit() {
            var x = new Contact(this.newContact);
            var payload = x.dbPrep();
            // Blanks out value if no phone #/email exists
            //payload.phoneNumbers = payload.phoneNumbers.filter(number => number.value != "");
            //payload.emails = payload.emails.filter(email => email.value != "");
            // Exit when the form isn't valid
            if (!this.checkFormValidity()) {
                return;
            }
            if (!this.isValidContact(payload)) {
                return;
            }

            this.createContact(payload)
            // Hide the modal manually
            this.$nextTick(() => {
                // Acess by id
                this.$bvModal.hide("add-contact-modal");
            });
        },
        addPhoneNumber(event, index) {
        event.preventDefault()
        if ((this.newContact.phoneNumbers.length-1) == index)
            this.newContact.phoneNumbers.push({
            name: "Home",
            value: ""
            })
        else
            this.newContact.phoneNumbers.splice(index, 1)
        },
        addEmail(event, index) {
        event.preventDefault()
        if ((this.newContact.emails.length-1) == index)
            this.newContact.emails.push({
            name: "Home",
            value: ""
            })
        else
            this.newContact.emails.splice(index, 1)
        },
        isValidContact(payload) {
        if (payload.firstName == '' &&
            payload.middleName == '' &&
            payload.lastName == '' &&
            payload.phoneNumbers.length == 0 &&
            payload.emails.length == 0)
            return false
            else
            return true
        },
        createContact(payload) {
            this.pageStatus.waitingOnAPICall = true;
            instance.post('api/contacts', payload)
                .then(async (response) => {
                    this.pageStatus.waitingOnAPICall = false;
                    this.$store.commit('addContact', {contact: response.data.result})
                })
                .catch((error) => {
                    this.pageStatus.waitingOnAPICall = false;
                    // TODO: Handle Errors
                    console.log(error);
                });
        }
    },
    beforeCreate(){
        this.contact = new Contact({});
    }
};
</script>

<style lang="scss" scoped>
.options-dropdown {
//   margin-top: 32px;
}
.plus-button {
    // margin-top: 35px;
    padding-left: 0px;
}
.plus-button-xtra {
    // margin-top: 4px;
    padding-left: 0px;
}
</style>