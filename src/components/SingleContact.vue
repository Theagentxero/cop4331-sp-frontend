<template>
    <div>
        <b-row>
            <b-col>Icon Here</b-col>
            <b-col>Content Here</b-col>
        </b-row>
    </div>
</template>

<script>
export default {
    name: 'singlecontactcard',
    props:{
        id: String,
        contactValue: Object,
    },
    data(){
        return{
            contact: {
                name:
                    {
                        first: null,
                        middle: null,
                        last: null
                    },
                phones:[
                    {name: null, value: null}
                ],
                emails:[
                    {name: null, value: null}
                ]
            },
            originalValue: {}
        }
    },
    methods: {
    
    },
    beforeMount (){
        this.originalValue = cloneDeep(this.contactValue);
        var tmp = cloneDeep(this.contactValue);
        this.contact.name = {
            first: tmp.firstName,
            middle: tmp.middleName,
            last: tmp.lastName
        };
        this.contact.phones = tmp.phoneNumbers;
        this.contact.emails = tmp.emails;
    },
}
</script>

<style>

</style>