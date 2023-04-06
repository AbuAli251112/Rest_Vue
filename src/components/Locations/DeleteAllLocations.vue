<template>
  <div class="container">
    <Navbar />
    <form @click.prevent>
      <div class="row g-3 align-items-center">
        <div class="col-auto mx-auto d-block">
          <h1>Delete All Locations</h1>
          <hr />
          <p class="text-danger">
            Are you sure you want to delete all locations?
          </p>
          <p class="text-danger">
            It will aslo delete all related items and categories... Be careful!
          </p>
          <hr />
        </div>
      </div>
      <div class="row g-3 align-items-center">
        <div class="col-auto mx-auto d-block">
          <button class="btn btn-info" @click="goBack()">Go Back</button>
          &nbsp;&nbsp;&nbsp;
          <button class="btn btn-danger" @click="deleteAllLocation()">
            Delete All
          </button>
        </div>
      </div>
      <br />
      <div class="row g-3 align-items-center">
        <div
          class="col-auto d-block mx-auto alert alert-warning"
          v-if="successMessage.length > 0"
        >
          {{ successMessage }}
        </div>
        <div
          class="col-auto d-block mx-auto alert alert-success"
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
  name: "DeleteAllLocations",
  components: {
    Navbar,
  },
  data() {
    return {
      userId: "",
      successMessage: "",
      errorMessage: "",
      allLocationId: [],
      allItemsIdIs: [],
      allCatsIdIs: [],
    };
  },
  async mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.redirectTo({ val: "Signup" });
    } else {
      this.userId = JSON.parse(user).id;
      //locations
      let resultLoc = await axios.get(
        `http://localhost:3000/locations?userId=${this.userId}`
      );
      let resultLocLen = resultLoc.data.length;
      for (var gi = 0; gi < resultLocLen; gi++) {
        this.allLocationId.push(resultLoc.data[gi].id);
      }
      //categories
      let resultCatLoc = await axios.get(
        `http://localhost:3000/categories?userId=${this.userId}`
      );
      let resultCatLocLen = resultCatLoc.data.length;
      for (var ti = 0; ti < resultCatLocLen; ti++) {
        this.allCatsIdIs.push(resultCatLoc.data[ti].id);
      }
      //items
      let resultItemsLoc = await axios.get(
        `http://localhost:3000/items?userId=${this.userId}`
      );
      let resultItemsLocLen = resultItemsLoc.data.length;
      for (var hi = 0; hi < resultItemsLocLen; hi++) {
        this.allItemsIdIs.push(resultItemsLoc.data[hi].id);
      }
    }
  },
  methods: {
    ...mapActions(["redirectTo"]),
    goBack() {
      this.redirectTo({ val: "home" });
    },
    async deleteAllLocation() {
      let allItemsResults = [];
      for (var c = 0; c < this.allItemsIdIs.length; c++) {
        let result2 = await axios.delete(
          `http://localhost:3000/items/${this.allItemsIdIs[c]}`
        );
        console.log(result2);
        if (result2.status == 200) {
          allItemsResults.push(true);
          console.log("items are deleted....");
        } else {
          allItemsResults.push(false);
          console.log("items are deleted....");
        }
      }
      let allCatsResults = [];
      for (var v = 0; v < this.allCatsIdIs.length; v++) {
        let result3 = await axios.delete(
          `http://localhost:3000/categories/${this.allCatsIdIs[v]}`
        );
        console.log(result3);
        if (result3.status == 200) {
          allCatsResults.push(true);
          console.log("cats are deleted....");
        } else {
          allCatsResults.push(false);
          console.log("cats are not deleted....");
        }
      }
      let allResults = [];
      for (var i = 0; i < this.allLocationId.length; i++) {
        let result = await axios.delete(
          `http://localhost:3000/locations/${this.allLocationId[i]}`
        );
        console.log(result);
        if (result.status == 200) {
          allResults.push(true);
          console.log("locations are deleted....");
        } else {
          allResults.push(false);
          console.log("locations are deleted....");
        }
      }
      if (
        !allResults.includes(false) &&
        !allItemsResults.includes(false) &&
        !allCatsResults.includes(false)
      ) {
        //all deleted successfully
        this.successMessage = "All Locations are deleted ...";
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
