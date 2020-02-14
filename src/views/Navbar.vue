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
        <b-nav-item variant="our-orange">Favorite Crabs</b-nav-item>
        <b-nav-item v-b-modal.add-contact-modal variant="our-orange">Add A Crab</b-nav-item>
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
</template>

<script>
export default {
  name: "Navbar"
}
</script>

<style lang="scss" scoped>
  $dark-orange: #FFC107;
#navbar{
  background: linear-gradient(to right, $dark-orange, $warning-variant);
  box-shadow: 0px 0px 5px 2px $warning-variant;
  color:black;
  #search-field {
    width: 50vw;
  }
}

#brand-icon {
  width: 60px;
}
</style>