<template>
  <div class="">
    <b-navbar toggleable="lg" type="dark" variant="dark">
      <!-- <a class="navbar-brand" href="https://www.google.com" target="_blank">
        <img src="../assets/anonymous_crab_orange.png" alt="Crabbie" class="navbar-icon">
      </a> -->
      <b-button v-b-modal.modal-1>
        <img src="../assets/anonymous_crab_orange.png" alt="Crabbie" class="navbar-icon">
      </b-button>

      <b-modal id="modal-1" title="DELETE CRAB">
        <p class="my-4">Hello from modal!</p>
      </b-modal>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collpase id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item href="#">Link</b-nav-item>
          <b-nav-item href="#">fdskfdsf</b-nav-item>
          <b-nav-item href="#">Ldsfdskhfsdk</b-nav-item>
        </b-navbar-nav>
      </b-collpase>
    </b-navbar>
  </div>
</template>

<script>
  export default {
    name: 'contacts'
  }
</script>

<style lang="scss" scoped>
.navbar-icon {
  width: 50px;
}
</style>
