<template>
  <b-navbar id="navbar" variant="our-orange" toggleable="lg">
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
        <b-nav-item variant="our-orange" v-on:click="favoritesToggle">Favorite Crabs</b-nav-item>
        <b-nav-item v-b-modal.add-contact-modal variant="our-orange">Add A Crab</b-nav-item>
        <b-nav-item-dropdown>
          <template v-slot:button-content>
            <em>User</em>
          </template>
          <b-dropdown-item href="#">Edit Info</b-dropdown-item>
          <b-dropdown-item href="#" v-on:click="signOut">Sign Out</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
      <!-- Right Aligned Navbar Items -->
      <b-navbar-nav class="ml-auto">
        <b-nav-form>
          <b-form-input v-model="searchParams.search" id="search-field" size="lg" class="mr-sm-2" 
                        :placeholder="(searchParams.options.onlyFavorites) ? 'Looking for crabbie...' : 'Searching favorite crabbies...'"></b-form-input>
          <b-button size="md" class="my-2 my-sm-0" v-on:click="searchContacts">Search</b-button>
        </b-nav-form>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
const _ = require('underscore');
const axios = require('axios');

const instance = axios.create({
    timeout: 10000,
    headers: {'Content-Type': 'application/json'},
    withCredentials: true
});

export default {
  name: "Navbar",
  data() {
    return {
      searchParams: {
        search: "",
        include: [],
        options: {
          onlyFavorites: false
        }
      },
      searchIncludes: ["firstName", "lastName", "middleName", "phoneNumbers", "emails"],
      pageStatus: {
        waitingOnAPICall: false
      },
    }
  },
  methods: {
    searchContacts() {
      this.pageStatus.waitingOnAPICall = true;
      instance.get('api/contacts/search', this.searchParams)
      .then(async (response) => {
        this.pageStatus.waitingOnAPICall = false;
        // this.$store.commit({type: 'searchedContacts', amount: response.data.result})
        console.log(response.data)
        // this.contactSections = this.$store.getters.getContacts;
      })
      .catch((error) => {
        this.pageStatus.waitingOnAPICall = false;
        // TODO: Handle Errors
        console.log(error);
      });
    },
    favoritesToggle() {
        // Toggle Favorites
        this.searchParams.options.onlyFavorites = !this.searchParams.options.onlyFavorites;
        // Clean Search
        var params = {
            search: "",
            include: [],
            options: {
                onlyFavorites: this.searchParams.options.onlyFavorites
            }
        }
        this.pageStatus.waitingOnAPICall = true;
        instance.get('api/contacts/search', this.params)
        .then(async (response) => {
            this.pageStatus.waitingOnAPICall = false;
            // this.$store.commit({type: 'searchedContacts', amount: response.data.result})
            console.log(response.data)
            // this.contactSections = this.$store.getters.getContacts;
        })
        .catch((error) => {
            this.pageStatus.waitingOnAPICall = false;
            // TODO: Handle Errors
            console.log(error);
        });
    },
    signOut(){
        // Clear Cookies
        instance.get('api/auth/logout.json')
            .then(async (response) => {
                if(response.status == 200){
                    // Clear Vuex
                    this.$store.commit('logout');
                    // Reroute
                    this.$router.push({path:"/"});
                }else{
                    console.log("Non 200 Returned Durring Logout")
                    // Clear Vuex
                    this.$store.commit('logout');
                    // Reroute
                    this.$router.push({path:"/"});
                }
            })
            .catch((error) => {
                console.log("Error Occured Durring Logout")
                // Clear Vuex
                this.$store.commit('logout');
                // Reroute
                this.$router.push({path:"/"});
            });
        
    }
  }
}
</script>

<style lang="scss" scoped>
#navbar{
  background: $warning-variant;
  box-shadow: 0px 0px 5px 2px $warning-variant;
  color:black;
  #search-field {
    width: 40vw;
  }
}

#brand-icon {
  width: 60px;
}
</style>