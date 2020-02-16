<template lang="pug">
    b-navbar#navbar(variant='our-orange', toggleable='md')
        // Navbar Brand
        b-navbar-brand(href='#')
            img#brand-icon(src='../assets/anonymous_crab_orange.png')
        // Navbar Toggle Button
        b-navbar-toggle(target='nav-collapse')
        // Collapsed Navbar Items
        b-collapse#nav-collapse(is-nav)
            // Left Aligned Navbar Items
            b-navbar-nav
                b-nav-item(variant='our-orange', v-on:click='favoritesToggle') Favorite Crabs
                b-nav-item(v-b-modal.add-contact-modal='', variant='our-orange') Add A Crab
                // Navbar User Dropdown
                b-nav-item-dropdown
                    template(v-slot:button-content='')
                        em(style="color: black") User
                    b-dropdown-item(href='#') Edit Info
                    b-dropdown-item(href='#', v-on:click='signOut') Sign Out
            // Right Aligned Navbar Items
            b-navbar-nav.ml-auto
                b-nav-form(@submit.stop.prevent='searchContacts')
                    b-form-input#search-field.mr-sm-2(v-model='searchParams.search', size='sm', :placeholder="(searchParams.options.onlyFavorites) ? 'Looking for crabbie...' : 'Searching favorite crabbies...'")
                    b-button.my-2.my-sm-0(type="submit", size='sm', variant="warning") Search
</template>

<script>
const _ = require('underscore');
const axios = require('axios');
const fetch = require('node-fetch');

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
      instance.post('api/contacts/search', this.searchParams)
      .then(async (response) => {
        this.pageStatus.waitingOnAPICall = false;
        this.$store.commit({type: 'loadContacts', contacts: response.data.result, meta:response.data.meta})
        this.$emit('searchContacts', response.data.result)
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
        instance.post('api/contacts/search', params)
        .then(async (response) => {
            this.pageStatus.waitingOnAPICall = false;
            this.$store.commit({type: 'loadContacts', amount: response.data.result})
        })
        .catch((error) => {
            this.pageStatus.waitingOnAPICall = false;
            // TODO: Handle Errors
            console.log(error);
        });
        // emit this.contactSections = this.$store.getters.getContacts;
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
$dark-orange: #FFC107;

#navbar{
  background: linear-gradient(to right, $dark-orange, $warning-variant);
  box-shadow: 0px 0px 5px 2px $warning-variant;
  color:black;
  #search-field {
    width: 20vw;
  }
  .form-control:focus {
    border-color: orange;
    box-shadow: 0px 0px 4px rgba(243, 156, 18, 1)
    inset, 1.5px 1.5px 2px rgba(232, 126, 4, 1);
  }
  .nav-link {
    color: #000;
  }
  
}

#brand-icon {
  width: 60px;
}
</style>

<style lang="scss">
.dropdown-item {
  color: black !important;
  &:hover {
    // color
  }
  &:active {
    background-color: #fcb219 !important;
  }
  &:focus {
    
  }
}
</style>