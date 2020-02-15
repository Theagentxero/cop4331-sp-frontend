<template>
    <b-col v-if="!selected" cols="6" sm="4" md="3" lg="2" class="text-center">
        <b-button 
            variant="our-orange" 
            :pressed.sync="selected"
        >
            <b-img-lazy :src="'/img/contact/' + contact.id" class="contact-icon mt-2"/>
        </b-button>
        <h1 v-if="contact.firstName != ''">{{contact.firstName}}</h1>
        <h1 v-else-if="contact.middleName != ''">{{contact.middleName}}</h1>
        <h1 v-else-if="contact.lastName != ''">{{contact.lastName}}</h1>
        <h1 v-else-if="contact.phoneNumbers.length != 0">{{contact.phoneNumbers[0].value}}</h1>
        <h1 v-else-if="contact.emails.length != 0">{{contact.emails[0].value}}</h1>
        <h1 v-else="">No Info</h1>
    </b-col>
    <b-col v-else="" cols="12">
        <ExpandedContact @closeComponent="updateSelected" :initContact="contact"></ExpandedContact>
    </b-col>
</template>

<script>
//import EditContact from './EditContact.vue';
import ExpandedContact from '@/components/ExpandedContact.vue';

const _ = require('underscore');
const {Contact} = require('../lib/contactHandler.js');

export default {
    name: 'ContactItem',
    components: {
        ExpandedContact,
        //EditContact
    },
    props: {
        initContact: Contact
    },
    data() {
        return {
            selected: false,
            contact: {}
        }
    },
    methods: {
        updateSelected() {
            this.selected = false;
            if(this.$store.getters.getByID(this.contact.id) == null){
                this.$emit('deleted')
            }else{
                this.contact = this.$store.getters.getByID(this.contact.id);
                var tmp = this.contact.id;
                this.contact.id = "123";
                this.contact.id = tmp;
            }
            
        }
    },
    beforeMount(){
        //console.log(this.initContact);
        this.contact = this.initContact;
    }
}
</script>

<style lang="scss" scoped>
.contact-icon {
  width: 90px;
}
h1 {
  font-size: 20px;
}
</style>