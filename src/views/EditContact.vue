<template>
  <b-container>
    <hr style="border-top: 26px solid rgba(0, 0, 0, 15.1);">
    <b-form>
      <!-- First Row -->
      <b-row>
        <b-col cols="10">
          <b-form-group
            id="input-group-1"
            label="Email address:"
            label-for="input-1"
          >
            <b-form-input
              id="input-1"
              v-model="contact.emails"
              type="email"
              placeholder="Enter email"
              disabled="true"
            ></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>

      <!-- Second Row -->
      <b-row>
        <b-col cols="8">
          <b-form-group
            id="input-group-2"
            label="Phone Numbers:"
            label-for="input-2"
          >
            <b-form-input
              id="input-2"
              v-model="contact.phoneNumbers"
              type="phone"
              placeholder="Enter phone #"
            ></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>

      <!-- Third Row -->
      <b-row>
        <b-col cols="6">
          <b-form-group
            id="input-group-3"
            label="First Name:"
            label-for="input-3">
            <b-form-input
              id="input-3"
              v-model="contact.firstName"
              placeholder="Enter First Name"
            ></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>

      <!-- Fourth Row -->
      <b-row>
        <b-col cols="4">
          <b-form-group
            id="input-group-4"
            label="Middle Name:"
            label-for="input-4">
            <b-form-input
              id="input-4"
              v-model="contact.middleName"
              placeholder="Enter Middle Name"
            ></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>

      <!-- Fifth Row -->
      <b-row>
        <b-col cols="2">
          <b-form-group
            id="input-group-5"
            label="Last Name:"
            label-for="input-5">
            <b-form-input
              id="input-5"
              v-model="contact.lastName"
              placeholder="Enter Last Name"
            ></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>

      <!-- Sixth Row -->
      <b-row>
        <b-col>
          <b-form-checkbox id="input-6" v-model="contact.favorite">Favorite Contact</b-form-checkbox>
        </b-col>
      </b-row>

      <b-row>
        <b-col>
          <b-button type="delete" variant="primary">Delete</b-button>
          <b-button type="edit" variant="danger">Edit</b-button>
          <b-button type="ok" variant="secondary" v-on:click="closeFunction">OK</b-button>
        </b-col>
      </b-row>
    </b-form>
    <b-card class="mt-3" header="Form Data Result">
      <pre class="m-0">{{ contact }}</pre>
    </b-card>
    <hr style="border-top: 26px solid rgba(0, 0, 0, 15.1);">
  </b-container>
</template>

<script>
export default {
  name: "EditContact",
  props: {
    contact: Object
  },
  methods: {
    closeFunction() {
      this.$emit('closeComponent')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>