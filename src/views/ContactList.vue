<template>
  <div>
    <b-container v-for="section, i in contactSections" class="contacts p-2">
      <b-row>
        <ContactItem :contact="contactSections[i][j]" v-for="contact, j in section" />
      </b-row>
    </b-container>
  </div>
</template>

<script>
import ContactItem from './ContactItem.vue'
export default {
  name: "ContactList",
  components: {
    ContactItem
  },
  data() {
    return {
      contactSections: [
        [
          {
          userID: "1",
          firstName: "AHole",
          middleName: "Elias",
          lastName: "Mora",
          favorite: true,
          phoneNumbers: [
            // Some Collection or Zero or More Objects Fitting This Prototype
            { name: "111-111-1111", value: "home" }
          ],
          emails:[
            // Some Collection or Zero or More Objects Fitting This Prototype
            { name: "aye@aye.com", value:"personal" },
            { name: "aye2@aye2.com", value:"home" }
          ]
          },
          {
            userID: "2",
            firstName: "AJoe",
            middleName: "El3ias",
            lastName: "Mor4a",
            favorite: false,
            phoneNumbers: [
              // Some Collection or Zero or More Objects Fitting This Prototype
              { name: "151-111-1111", value: "home" }
            ],
            emails:[
              // Some Collection or Zero or More Objects Fitting This Prototype
              { name: "ane@aye.com", value:"gogo" },
              { name: "ane2@aye2.com", value:"gadget" }
            ]
          }
        ],
        [
          {
            userID: "3",
            firstName: "",
            middleName: "Bl3ias",
            lastName: "Mor4a",
            favorite: true,
            phoneNumbers: [
              // Some Collection or Zero or More Objects Fitting This Prototype
              { name: "777-111-1111", value: "home" }
            ],
            emails:[
              // Some Collection or Zero or More Objects Fitting This Prototype
              { name: "bne@aye.com", value:"gogo" },
              { name: "bne2@aye2.com", value:"gadget" }
            ]
          }
        ]
      ]
    }
  },
  methods: {
    getContacts() {

    }
  }
}
</script>

<style lang="scss" scoped>
$dark-orange: #FFC107;

.contacts {
  background: linear-gradient(to right, $dark-orange, $warning-variant);
  margin-top: 5rem;
  margin-bottom: 5rem;
  box-shadow: 0px 0px 10px 3.5px gray;
}
</style>