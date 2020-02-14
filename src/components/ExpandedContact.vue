<template>
  <b-container>
    <h4>{{contact.formattedName()}}</h4>
    <b-row class="reducePaddingNotMarin">
      <b-col cols="3">
        <b-row><img class="img-fluid fav-star favorite" src="../assets/star.png" v-if="contact.favorite" /><img class="img-fluid" :id="'contact-img-' + contact.id" :src="'/img/contact/' + contact.id" />
          <form :id="'imageUploadForm-' + contact.id" style="display:none;">
            <input type="file" :id="'contactimg-' + contact.id" name="contactimg" accept="image/png, image/jpeg, image/gif, image/tiff, image/bmp" style="display:none;" />
          </form>
        </b-row>
        <b-row class="text-center">
          <b-col class="removePadding" cols="12" lg="4">
            <b-button class="buttons mb-1" type="edit" size="sm" variant="our-orange" v-if="notEditable" v-on:click="editComponent">Edit</b-button>
            <b-button class="buttons mb-1" variant="our-orange" size="sm" v-else="" v-on:click="updateContact">Save</b-button>
          </b-col>
          <b-col class="removePadding" cols="12" lg="4">
            <b-button class="buttons mb-1" variant="our-orange" size="sm" v-model="contact.favorite" v-if="notEditable" v-on:click="favoriteContact">Favorite</b-button>
            <b-button class="buttons mb-1" v-b-modal.modal-sm="" type="delete" size="sm" variant="danger" v-else="" v-on:click="deleteContact">Delete</b-button>
          </b-col>
          <b-col class="removePadding" cols="12" lg="4">
            <b-button class="buttons mb-1" type="ok" variant="our-orange" size="sm" v-if="notEditable" v-on:click="closeComponent">OK</b-button>
            <b-button class="buttons mb-1" type="edit" variant="our-orange" size="sm" v-else="" v-on:click="cancelEdit">Cancel</b-button>
          </b-col>
        </b-row>
      </b-col>
      <b-col cols="9">
        <b-row>
          <b-col cols="12" md="6" lg="4">
            <b-form-group id="input-group-3" label-size="sm" label="First Name:" label-for="input-3">
              <b-form-input class="form-control" id="input-3" size="sm" v-model="contact.firstName" placeholder="Enter First Name" :disabled="notEditable"></b-form-input>
            </b-form-group>
          </b-col>
          <b-col cols="12" md="6" lg="4">
            <b-form-group id="input-group-4" label-size="sm" label="Middle Name:" label-for="input-4">
              <b-form-input id="input-4" size="sm" v-model="contact.middleName" placeholder="Enter Middle Name" :disabled="notEditable"></b-form-input>
            </b-form-group>
          </b-col>
          <b-col cols="12" md="12" lg="4">
            <b-form-group id="input-group-5" label-size="sm" label="Last Name:" label-for="input-5">
              <b-form-input id="input-5" size="sm" v-model="contact.lastName" placeholder="Enter Last Name" :disabled="notEditable"></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>
        <div v-for="email, index in contact.emails">
          <b-row class="modal-phone-and-email">
            <b-col cols="5" sm="6" md="7">
              <b-form-group :label="(index == 0) ? 'Email(s): ' : ''" label-for="email-input">
                <b-form-input id="email-input" size="sm" v-model="contact.emails[index].value" :disabled="notEditable"></b-form-input>
              </b-form-group>
            </b-col>
            <b-col class="dropDown" cols="5" :class="(index == 0) ? 'options-dropdown' : ''">
              <b-row>
                <b-col cols="11">
                  <b-form-group id="input-group-2" label-for="input-2">
                    <b-form-select class="form-control" id="input-2" size="sm" v-model="contact.emails[index].name" :options="typeOptions" :disabled="notEditable" required="required"></b-form-select>
                  </b-form-group>
                </b-col>
                <b-col class="removePadding" cols="1">
                  <b-button class="add" size="sm" squared="" variant="our-orange" v-on:click="addEmail($event, index)" v-text="(contact.emails.length-1) == index ? '+' : '-'"></b-button>
                </b-col>
              </b-row>
            </b-col>
          </b-row>
        </div>
        <div v-for="phone, index in contact.phoneNumbers">
          <b-row class="modal-phone-and-email">
            <b-col cols="5" sm="6" md="7">
              <b-form-group :label="(index == 0) ? 'Phone Number(s): ' : ''" label-for="phone-number-input">
                <b-form-input id="phone-number-input" size="sm" v-model="contact.phoneNumbers[index].value" :formatter="phoneFormat" :disabled="notEditable"></b-form-input>
              </b-form-group>
            </b-col>
            <b-col class="dropDown" cols="5" :class="(index == 0) ? 'options-dropdown phone-dropdown' : ''">
              <b-row>
                <b-col cols="11">
                  <b-form-group id="input-group-1" label-for="input-1">
                    <b-form-select class="form-control" id="input-1" size="sm" v-model="contact.phoneNumbers[index].name" :options="typeOptions" :disabled="notEditable" required="required"></b-form-select>
                  </b-form-group>
                </b-col>
                <b-col class="removePadding" cols="1">
                  <b-button class="add" size="sm" squared="" variant="our-orange" v-on:click="addPhone($event, index)" v-text="(contact.phoneNumbers.length-1) == index ? '+' : '-'"></b-button>
                </b-col>
              </b-row>
            </b-col>
          </b-row>
        </div>
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
            originalContact: {},
            unchangedContact: {}
        }
    },
    methods: {
        editComponent(event) {
            event.preventDefault();
            this.notEditable = false;
            this.contact = new Contact(this.originalContact);
            this.contact.addPhoneNumber({name:'Home',value: ''});
            this.contact.addEmail({name:'Home',value: ''});
        },
        cancelEdit(event) {
            event.preventDefault();
            this.notEditable = true;
            this.contact = new Contact(this.originalContact);
            document.getElementById('contact-img-' + this.contact.id).setAttribute( 'src', '/img/contact/' + this.contact.id);
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
        phoneFormat(input){
            return phoneNumberLib.format(input);
        },
        addPhone(event, index){
          if ((this.contact.phoneNumbers.length-1) == index)
            this.contact.addPhoneNumber({name:'Home',value: ''});
          else
            this.contact.phoneNumbers.splice(index, 1)
        },
        addEmail(event, index){
          if ((this.contact.emails.length-1) == index)
            this.contact.addEmail({name:'Home',value: ''});
          else
            this.contact.emails.splice(index, 1)
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
        favoriteContact(){
          this.contact.favorite = !this.contact.favorite;
          instance.put(`api/contacts/${this.contact.id}`, this.contact.dbPrep())
            .then(async (response) => {
              console.log(response.data)
              console.log("Added Favorite Successfully");
              this.pageStatus.waitingOnAPICall = false
              this.contact = new Contact(response.data.result);
              this.$store.commit('updateContact', {contact: new Contact(response.data.result)});
              this.originalContact = new Contact(response.data.result).dbPrep()
              this.contact = new Contact(response.data.result);
            })
            .catch((error) => {
              this.pageStatus.waitingOnAPICall = false;
              // TODO: Handle Errors
              console.log(error);
            });
        },
        updateContact() {
            this.pageStatus.waitingOnAPICall = true
            console.log(this.contact.dbPrep());
            var file = document.getElementById('contactimg-' + this.contact.id);
            var fdata = new FormData();
            if( _.has(file, "files") && file.files && file.files != undefined){
              // User Has New Image To Upload
              fdata.append("contactimg", file.files[0]);
              formData.post(`img/contact/${this.contact.id}`, fdata)
                .then(async (response) => {
                  this.triggerPhotoUpdate();
                })
                .catch((error) => {
                  // TODO: Handle Errors
                  console.log(error);
                });
            }
            
            instance.put(`api/contacts/${this.contact.id}`, this.contact.dbPrep())
              .then(async (response) => {
                //console.log(response.data)
                this.pageStatus.waitingOnAPICall = false
                this.contact = new Contact(response.data.result);
                this.$store.commit('updateContact', {contact: new Contact(response.data.result)});
                this.originalContact = new Contact(response.data.result).dbPrep()
                this.notEditable = true;
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
            
        }
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
  },
  mounted(){
    document.getElementById('contact-img-' + this.contact.id).addEventListener("click",()=>{
      if(!this.notEditable){
        // Show File Upload Box
        var contactFileUpload = document.getElementById('contactimg-' + this.contact.id)
        contactFileUpload.click();
        contactFileUpload.addEventListener('change', () =>{
          console.log("Some Change Occured On File")
          if(contactFileUpload.files){
            // User Selected A File To Upload
            var fdata = new FormData();
              fdata.append("contactimg", contactFileUpload.files[0]);
              formData.post(`img/preview`, fdata)
                .then(async (response) => {
                  console.log(response.data);
                  document.getElementById('contact-img-' + this.contact.id).setAttribute( 'src', response.data);
                })
                .catch((error) => {
                  // TODO: Handle Errors
                  console.log(error);
                });
          }
        });
      }
    });
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

<style scoped lang="scss">
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

.fav-star {
  position: absolute;
  width: 60px;
}
</style>