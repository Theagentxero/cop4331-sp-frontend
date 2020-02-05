<template>
<<<<<<< HEAD
  <div class="">
    <!-- Navbar -->
    <b-navbar id="navbar" variant="warning" toggleable="lg">
      <!-- Navbar Brand -->
      <b-navbar-brand href="#">
        <img id="brand-icon" src="../assets/anonymous_crab_orange.png">
        Crabrr
      </b-navbar-brand>

      <!-- Navbar Toggle Button -->
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <!-- Collapsed Navbar Items -->
      <b-collapse id="nav-collapse" is-nav>
        <!-- Left Aligned Navbar Items -->
        <b-navbar-nav>
          <b-nav-item variant="warning">Favorite Crabs</b-nav-item>
          <b-nav-item v-b-modal.add-contact-modal variant="warning">Add A Crab</b-nav-item>
          <b-nav-item-dropdown>
            <template v-slot:button-content>
              <em>User</em>
            </template>
            <b-dropdown-item href="#">Edit Info</b-dropdown-item>
            <b-dropdown-item href="#">Sign Out</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
        <!-- Right Aligned Navbar Items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-form>
            <b-form-input id="search-field" size="lg" class="mr-sm-2" placeholder="Looking for crabbie..."></b-form-input>
          </b-nav-form>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    
    <!-- Add Contact Modal -->
    <b-modal 
      id="add-contact-modal"
      ok-variant="warning" 
      ok-title="Add" 
      cancel-variant="outline-danger" 
      header-bg-variant="warning"
      ref="add-contact-modal"
      title="New Contact"
      @show="resetModal"
      @hidden="resetModal"
      @ok="handleOk"
    >
      <b-form ref="form" @submit.stop.prevent="handleSubmit">
        <b-form-group label="First Name:" label-for="first-name-input">
          <b-form-input id="first-name-input" v-model="addContactSubmitForm.firstName"></b-form-input>
        </b-form-group>

        <b-form-group label="Middle Name:" label-for="middle-name-input">
          <b-form-input id="middle-name-input" v-model="addContactSubmitForm.middleName"></b-form-input>
        </b-form-group>

        <b-form-group label="Last Name:" label-for="last-name-input">
          <b-form-input id="last-name-input" v-model="addContactSubmitForm.lastName"></b-form-input>
        </b-form-group>

        <template v-for="phone in phoneNumberQuantity">
          <b-row class="modal-phone-and-email" :key="phone">
            <b-col cols="6">
              <b-form-group :label="(phone == 1) ? 'Phone Number: ' : ''" label-for="phone-number-input">
                <b-form-input id="phone-number-input" v-model="addContactSubmitForm.phoneNumbers[0].name"></b-form-input>
              </b-form-group>
            </b-col>
            <b-col cols="5" :class="(phone == 1) ? 'options-dropdown' : ''">
              <b-form-group id="input-group-1" label-for="input-1">
                <b-form-select
                  id="input-1"
                  v-model="addContactSubmitForm.phoneNumbers[0].value"
                  :options="typeOptions"
                  required
                ></b-form-select>
              </b-form-group>
            </b-col>
            <b-col cols="1" :class="(phone == 1) ? 'plus-button' : 'plus-button-xtra'">
              <b-button class="add" size="sm" squared variant="warning"> + </b-button>
            </b-col>
          </b-row>
        </template>

        <template v-for="email in emailQuantity">
          <b-row class="modal-phone-and-email" :key="email">
            <b-col cols="6">
              <b-form-group :label="(email == 1) ? 'Email: ' : ''" label-for="email-input">
                <b-form-input id="email-input" v-model="addContactSubmitForm.emails[0].name"></b-form-input>
              </b-form-group>
            </b-col>
            <b-col cols="5" :class="(email == 1) ? 'options-dropdown' : ''">
              <b-form-group id="input-group-2" label-for="input-2">
                <b-form-select
                  id="input-2"
                  v-model="addContactSubmitForm.emails[0].value"
                  :options="typeOptions"
                  required
                ></b-form-select>
              </b-form-group>
            </b-col>
            <b-col cols="1" :class="(email == 1) ? 'plus-button' : 'plus-button-xtra'">
              <b-button class="add" size="sm" squared variant="warning"> + </b-button>
            </b-col>
          </b-row>
        </template>
      </b-form>
    </b-modal>

    <!-- List of Contacts -->
    <b-container v-for="row in numRows" :key="row" class="contacts p-2">
      <b-row>
        <b-col class="text-center" v-for="col in numCols" :key="col" cols="6" sm="4" md="3" lg="2">
          <img class="contact-icon mt-2" src="../assets/anonymous_crab_orange.png">
          <h1>Mr.Crabs</h1>
        </b-col>
      </b-row>
    </b-container>
  </div>
=======
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
>>>>>>> 489b367be214c791f69b0eee1c3adfca7f29b4f5
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
<<<<<<< HEAD
$warning-variant: #f69b29;
=======
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
>>>>>>> 489b367be214c791f69b0eee1c3adfca7f29b4f5

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
  h1{
    font-size: 20px;
  }
  .contact-icon {
    width: 90px;
  }
}
.modal-phone-and-email {
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
}
#navbar{
  background: $warning-variant;
  box-shadow: 0px 0px 5px 2px $warning-variant;
  color:black;
  #search-field {
    width: 50vw;
  }
}

.bg-warning {
    background-color: $warning-variant !important;
}
</style>
