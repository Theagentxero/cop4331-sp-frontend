<template>
  <div class="">
    <!-- Navbar -->
    <b-navbar variant="warning" toggleable="lg">
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
          <b-nav-item v-b-modal.modal-add-contact variant="warning">Add A Crab</b-nav-item>
        </b-navbar-nav>
        
        <!-- Right Aligned Navbar Items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-form>
            <b-form-input size="sm" class="mr-sm-2" placeholder="Looking for crabbie..."></b-form-input>
            <b-button size="sm" class="my-2 my-sm-0" type="submit">Find Crab</b-button>
          </b-nav-form>
          <b-nav-item size="sm" variant="warning">Sign Out</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    
    <!-- Add Contact Modal -->
    <b-modal 
      id="modal-add-contact"
      ok-variant="warning" 
      ok-title="Add" 
      cancel-variant="outline-danger" 
      header-bg-variant="warning"
      ref="modal"
      title="New Contact"
      @show="resetModal"
      @hidden="resetModal"
      @ok="handleOk"
    >
      <b-form ref="form" @submit.stop.prevent="handleSubmit">
        <b-form-group :state="nameState" label="First Name:" label-for="name-input">
          <b-form-input id="name-input" v-model="name" :state="nameState"></b-form-input>
        </b-form-group>

        <b-form-group :state="nameState" label="Middle Name:" label-for="name-input">
          <b-form-input id="name-input" v-model="name" :state="nameState"></b-form-input>
        </b-form-group>

        <b-form-group :state="nameState" label="Last Name:" label-for="name-input" invalid-feedback="Name is required">
          <b-form-input id="name-input" v-model="name" :state="nameState" required></b-form-input>
        </b-form-group>

        <b-row>
          <b-col>
            <b-form-group class="b" :state="nameState" label="Phone Number: " label-for="name-input">
              <b-form-input id="name-input" v-model="name" :state="nameState" required></b-form-input>
            </b-form-group>
          </b-col>
          <b-col style="margin-top: 35px;">
            <b-button size="sm" squared variant="warning">Personal</b-button>
            <b-button size="sm" squared variant="warning">Work</b-button>
            <b-button size="sm" squared variant="warning">Home</b-button>
            <b-button class="add" size="sm" squared variant="warning"> + </b-button>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-form-group :state="nameState" label="Email:" label-for="name-input">
              <b-form-input id="name-input" v-model="name" :state="nameState" required></b-form-input>
            </b-form-group>
          </b-col>
          <b-col style="margin-top: 35px;">
            <b-button size="sm" squared variant="warning">Personal</b-button>
            <b-button size="sm" squared variant="warning">Work</b-button>
            <b-button size="sm" squared variant="warning">Home</b-button>
            <b-button class="add" size="sm" squared variant="warning"> + </b-button>
          </b-col>
        </b-row>
      </b-form>
    </b-modal>

    <b-container v-for="row in numRows" :key="row" class="contacts p-2">
      <b-row>
        <b-col class="text-center" v-for="col in numCols" :key="col" cols="6" sm="4" md="3" lg="2">
          <img class="contact-icon mt-2" src="../assets/anonymous_crab_orange.png">
          <h1>Mr.Crabs</h1>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>


<script>
  export default {
    name: 'contacts',
    data() {
      return {
        numRows: 10,
        numCols: 20
      }
    }
  }
</script>

<style lang="scss" scoped>
$warning-variant: #ffc107;

#brand-icon {
  width: 60px;
}

.contacts{
  background-color: $warning-variant !important;
  margin-top: 5rem;
  margin-bottom: 5rem;
  box-shadow: 0px 0px 10px 3.5px gray;
  h1{
    font-size: 20px;
  }
  .contact-icon {
    width: 90px;
  }
}
</style>
