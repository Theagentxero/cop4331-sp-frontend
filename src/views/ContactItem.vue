<template>
  <div class="contact-item">
    <p>{{contact.title}}
    </p>
    <b-container class="contacts">
      <b-row align-v="start">
        <b-col>
          <div>
            <b-button class="home" variant="outline-warning" v-b-modal.modal-1><img src="https://cdn.discordapp.com/attachments/664299938074722315/667846011808382980/anonymous_crab_orange.png" style="width:90px"></b-button>
            <b-modal ok-variant="warning" id="modal-1" title="Mr.Crabs" cancel-variant="warning" cancel-title="Edit">
              <p class="my-4">Email:</p>
              <p class="my-4">Phone (work): 40777777</p>
              <b-button @click="$emit('delete-contact', contact.id)" class="delete" size="sm" squared variant="warning">Delete</b-button>
            </b-modal>
          </div>
          <h1>Mr.Crabs</h1>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>


<script>
export default{
  name: "ContactItem",
  props:["contact"],
  methods: {
    deleteContact() {

    },
    editContact() {

    }
  }
}
</script>


<style scoped>
{
  .home {
    background-color: #FF9C08;
    color: black;
    border: none;
    &:hover {
      background-color: #FF9C08;
      border: none;
    }
  }

  .contacts{
    background-color: #FF9C08;
  }

  .h1{
    margin-left: 12px;
  }
}

.contact-item{
  background-color: #FF9C08;
}
</style>
