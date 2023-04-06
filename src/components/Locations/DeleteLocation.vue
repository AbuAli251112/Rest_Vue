<template>
  <div class="container">
    <Navbar />
    <form @click.prevent>
      <div class="row g-3 align-items-center">
        <div class="col-auto mx-auto d-block">
          <h1>Delete Restaurant #{{ deleteLoction }}</h1>
          <hr />
          <p class="text-danger">
            Are you sure you want to delete this location?
          </p>
          {{ name }}<br />
          {{ address }}<br />
          {{ phone }}<br />
          <hr />
        </div>
      </div>
      <div class="row g-3 align-items-center">
        <div class="col-auto mx-auto d-block">
          <button class="btn btn-info" @click="goBack()">Go Back</button>
          &nbsp;&nbsp;&nbsp;
          <button class="btn btn-danger" @click="deleteLocation()">
            Delete Now
          </button>
        </div>
      </div>
      <br />
      <div class="row g-3 align-items-center">
        <div
          class="col-auto d-block mx-auto alert alert-success"
          v-if="successMessage.length > 0"
        >
          {{ successMessage }}
        </div>
        <div
          class="col-auto d-block mx-auto alert alert-warning"
          v-if="errorMessage.length > 0"
        >
          {{ errorMessage }}
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import Navbar from "@/components/Header/Navbar.vue";
import { mapActions } from "vuex";
import axios from "axios";
export default {
  name: "DeleteLocation",
  components: {
    Navbar,
  },
  data() {
    return {
      name: "",
      address: "",
      phone: "",
      userId: "",
      deleteLoction: "",
      locationData: [],
      successMessage: "",
      errorMessage: "",
      allItemsIdIs: [],
      allCatsIdIs: [],
    };
  },
  async mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.redirectTo({ val: "Signup" });
    } else {
      this.deleteLoction = this.$route.params.locationId;
      this.userId = JSON.parse(user).id;
      this.canCurrentUserAccessThisLocation();
      let result = await axios.get(
        `http://localhost:3000/items?locId=${this.locationId}`
      );
      let resultLen = result.data.length;
      for (var i = 0; i < resultLen; i++) {
        this.allItemsIdIs.push(result.data[i].id);
      }
      let resultForCategories = await axios.get(
        `http://localhost:3000/categories?locationId=${this.locationId}`
      );
      let resultCatLen = resultForCategories.data.length;
      for (var c = 0; c < resultCatLen; c++) {
        this.allCatsIdIs.push(resultForCategories.data[c].id);
      }
    }
  },
  methods: {
    ...mapActions(["redirectTo"]),
    goBack() {
      this.redirectTo({ val: "home" });
    },
    async canCurrentUserAccessThisLocation() {
      let result = await axios.get(
        `http://localhost:3000/locations?id=${this.deleteLoction}&userId=${this.userId}`
      );
      if (result.status == 200 && result.data.length > 0) {
        this.locationData = result.data;
        this.name = this.locationData[0].name;
        this.address = this.locationData[0].address;
        this.phone = this.locationData[0].phone;
      } else {
        this.redirectTo({ val: "home" });
      }
    },
    async deleteLocation() {
      let result = await axios.delete(
        `http://localhost:3000/locations/${this.deleteLoction}`
      );
      let allCatsResults = [];
      for (var v = 0; v < this.allCatsIdIs.length; v++) {
        let result = await axios.delete(
          `http://localhost:3000/categories/${this.allCatsIdIs[v]}`
        );
        if (result.status == 200) {
          allCatsResults.push(true);
        } else {
          allCatsResults.push(false);
        }
      }
      let allItemsResults = [];
      for (var y = 0; y < this.allItemsIdIs.length; y++) {
        let result = await axios.delete(
          `http://localhost:3000/items/${this.allItemsIdIs[y]}`
        );
        if (result.status == 200) {
          allItemsResults.push(true);
        } else {
          allItemsResults.push(false);
        }
      }
      if (
        result.status == 200 &&
        !allCatsResults.includes(false) &&
        !allItemsResults.includes(false)
      ) {
        this.successMessage = "Location is deleted ...";
        this.errorMessage = "";
        setTimeout(() => {
          this.redirectTo({ val: "home" });
        }, 2000);
      } else {
        this.successMessage = "";
        this.errorMessage = "Something Went Wrong, try again";
      }
    },
  },
};
</script>

<style></style>
