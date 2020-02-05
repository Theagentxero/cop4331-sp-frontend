<template>
  <div id="contact">
      <Contact v-bind:contact="contact" v-on:delete-contact="deleteContact" />
      <b-navbar toggleable="lg" type="light" class="nav">
        <b-navbar variant="faded" type="light">
          <b-navbar-brand href="#">
            <img src="https://cdn.discordapp.com/attachments/664299938074722315/667846011808382980/anonymous_crab_orange.png" style="width:60px">
              Crabrr
          </b-navbar-brand>
        </b-navbar>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-button class="home" variant="outline-warning">Favorite Crabs</b-button>
            <b-button v-b-modal.modal-prevent-closing class="home" variant="outline-warning">Add A Crab</b-button>

                <b-navbar-nav>
                  <b-nav-item-dropdown>
                    <template v-slot:button-content>
                      <em>User</em>
                    </template>
                    <b-dropdown-item href="#">Edit Info</b-dropdown-item>
                    <b-dropdown-item href="#">Sign Out</b-dropdown-item>
                  </b-nav-item-dropdown>
                </b-navbar-nav>

                <b-nav-form>
                  <b-form-input size="sm" class="mr-sm-2" placeholder="Looking for..."></b-form-input>
                  <b-button size="sm" class="my-2 my-sm-0" type="submit">Find Crab</b-button>
                  </b-nav-form>
            </b-navbar-nav>
          </b-nav-form>
          </b-navbar-nav>
        </b-collapse>

          <b-modal ok-variant="warning" ok-title="Add" cancel-variant="outline-danger" header-bg-variant="warning"
    id="modal-prevent-closing"
    ref="modal"
    title="New Contact"
    @show="resetModal"
    @hidden="resetModal"
    @ok="handleOk"
  >
    <form ref="form" @submit.stop.prevent="handleSubmit">
      <b-form-group
        :state="nameState"
        label="First Name:"
        label-for="name-input"
      >
        <b-form-input
          id="name-input"
          v-model="name"
          :state="nameState"
        ></b-form-input>
      </b-form-group>

      <b-form-group
        :state="nameState"
        label="Middle Name:"
        label-for="name-input"
      >
        <b-form-input
          id="name-input"
          v-model="name"
          :state="nameState"
        ></b-form-input>
      </b-form-group>

      <b-form-group
        :state="nameState"
        label="Last Name:"
        label-for="name-input"
        invalid-feedback="Name is required"
      >
        <b-form-input
          id="name-input"
          v-model="name"
          :state="nameState"
          required
        ></b-form-input>
      </b-form-group>

<b-row>
    <b-col>
      <b-form-group class="b"
        :state="nameState"
        label="Phone Number: "
        label-for="name-input"
      >

      <b-form-input
        id="name-input"
        v-model="name"
        :state="nameState"
        required
      ></b-form-input>
            </b-form-group>
    </b-col>
      <b-col>
      <b-row class="buttons" align-v="start">
        <div>
        <b-button size="sm" squared variant="warning">Personal</b-button>
        </div>
        <div>
        <b-button size="sm" squared variant="warning">Work</b-button>
        </div>
        <div>
        <b-button size="sm" squared variant="warning">Home</b-button>
        </div>
        <div>
        <b-button class="add" size="sm" squared variant="warning"> + </b-button>
        </div>
        </b-row>
      </b-col>
    </b-row>

      <b-form-group
        :state="nameState"
        label="Email:"
        label-for="name-input"
      >
        <b-form-input
          id="name-input"
          v-model="name"
          :state="nameState"
          required
        ></b-form-input>
      </b-form-group>

    </form>
  </b-modal>
  </b-navbar>
</b-collapse>
</b-navbar>

<b-container class="contacts">
  <b-row align-v="start">
    <b-col>
      <div>
        <b-button class="home" variant="outline-warning" v-b-modal.modal-1><img src="https://cdn.discordapp.com/attachments/664299938074722315/667846011808382980/anonymous_crab_orange.png" style="width:90px"></b-button>
        <b-modal ok-variant="warning" id="modal-1" title="Mr.Crabs" cancel-variant="warning" cancel-title="Edit">
          <p class="my-4">Email:</p>
          <p class="my-4">Phone (work): 40777777</p>
          <b-button size="sm" squared variant="warning">Delete </b-button>
        </b-modal>
      </div>
      <h1>Mr.Crabs</h1>
    </b-col>
  </b-row>
</b-container>

</div>
</div>
</div>
</div>
</template>


<script>
  import Contact from './Contact';
  export default {
    name: 'contact',
    components: {
      Contact
    },
    data() {
      return {
        contact: [
          {
            id: 1,
            //phone and email here?
          },
          {
            id: 2,
            //phone and email here?
          },
          {
            id: 3,
            //phone and email here?
          },
        ]
      }
    },
    methods: {
      deleteContact(id){
        this.contact = this.contact.filter(contact => contact.id !== id);
      }
    }
}
</script>

<style lang="scss" scoped>
h1{
  font-size: 20px;
  margin-left: 12px;
}

.nav{
  height:2cm;
  background-color: #FF9C08;
  box-shadow: 0px 0px 5px 2px orange;
  color:black;
}

.add{
  font-size:14px;
}

.b{
  width:200px;
}

.mr-sm-2{
  margin-left:550px;
}

.buttons{
  margin-left: 1px;
}

.home{
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

.contacts{
  width: 2200px;
  background-color: #FF9C08;
  margin-top: 80px;
  margin-bottom: 80px;
  padding: 30px;
  box-shadow: 0px 0px 10px 3.5px gray;
  color:black;
}

.navbar-icon {
  width: 50px;
}
</style>
