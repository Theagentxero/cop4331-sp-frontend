<template>
    <b-col v-if="!selected" cols="12" md="5" lg="5" class="contact-boxed-horiz">
        <b-row >
            <b-col cols="3">
                <img :src="'/img/contact/' + contact.id" class="contact-icon mt-2" v-on:click="toggleSelected"/>
            </b-col>
            <b-col cols="8" class="formatted-contact-info-horiz">
                <b-row>
                    <b-col>
                        {{contact.formattedName()}}
                    </b-col>
                </b-row>
                <b-row>
                    <b-col>
                        {{contact.getFirstPhone()}}
                    </b-col>
                </b-row>
                <b-row>
                    <b-col>
                        {{contact.getFirstEmail()}}
                    </b-col>
                </b-row>
            </b-col>
        </b-row>
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
        },
        toggleSelected() {
            this.selected = !this.selected;
        }
    },
    beforeMount(){
        //console.log(this.initContact);
        this.contact = this.initContact;
    }
}
</script>

<style lang="scss" scoped>
$dark-orange: #FFC107;
.contact-icon {
  width: 90px;
}
h1 {
  font-size: 20px;
}
.formatted-contact-info-horiz{
    padding-top: 1vh;
    font-size: 20px;
}
.contact-boxed-horiz{
    background: linear-gradient(to right, $dark-orange, $warning-variant);
    padding-bottom: 1vh;
    box-shadow: 0px 0px 10px 3.5px gray;
    margin-bottom: 25px;
}
</style>