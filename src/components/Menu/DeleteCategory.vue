<template>
  <div class="container">
    <Navbar />
    <form @click.prevent>
      <div class="row p-3 align-items-center text-center">
        <div class="col-auto mx-auto d-block">
          <h1>Delete Category #{{ catId }}</h1>
          <h4>Category Name: #{{ name }}</h4>
          <hr />
          <p class="text-danger">
            Are You Sure You Want To Delete This Category?
          </p>
          <hr />
        </div>
      </div>
      <div class="row p-3 align-items-center text-center">
        <div class="col-auto mx-auto d-block">
          <button @click="goBack" class="btn btn-info">Go Back</button
          >&nbsp;&nbsp;&nbsp;
          <button @click="deleteCategory()" class="btn btn-danger">
            Delete Now
          </button>
        </div>
      </div>
      <div class="row align-items-center text-center">
        <div
          class="col-auto d-block mx-auto alert alert-success"
          v-if="SuccessMessage.length > 0"
        >
          {{ SuccessMessage }}
        </div>
        <div
          class="col-auto d-block mx-auto alert alert-danger"
          v-if="ErrorMessage.length > 0"
        >
          {{ ErrorMessage }}
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import Navbar from "../Header/Navbar.vue";
import { mapMutations, mapActions } from "vuex";
import axios from "axios";

export default {
  name: "DeleteCategory",
  components: { Navbar },
  data() {
    return {
      locationId: this.$route.params.locationId,
      catId: this.$route.params.catId,
      userId: "",
      locationData: "",
      SuccessMessage: "",
      ErrorMessage: "",
      name: "",
      allItemsIdIs: [],
    };
  },
  async mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.redirectTo({ val: "login" });
    } else {
      this.deleteLocation = this.$route.params.locationId;
      this.userId = JSON.parse(user).id;
      this.canCurrentUserAccessThisLocation();
      this.canUserAccessThisCategory({
        userIdIs: this.userId,
        catIdIs: this.catId,
        locationIdIs: this.locationId,
        redirectToPage: "home",
      });
      this.getCategoryName(this.userId, this.locationId, this.catId);
      let result = await axios.get(
        `http://localhost:3000/items?catId=${this.catId}`
      );
      console.log(result.data.length);
      let resultLen = result.data.length;
      for (var i = 0; i < resultLen; i++) {
        this.allItemsIdIs.push(result.data[i].id);
      }
    }
  },
  methods: {
    ...mapMutations(["canUserAccessThisCategory"]),
    ...mapActions(["redirectTo"]),
    goBack() {
      this.$router.push({
        name: "ViewCategories",
        params: { locationId: this.locationId },
      });
    },
    async canCurrentUserAccessThisLocation() {
      let result = await axios.get(
        `http://localhost:3000/locations?id=${this.deleteLocation}&userId=${this.userId}`
      );
      if ((result.status === 200) & (result.data.length > 0)) {
        this.locationData = result.data;
        this.name = this.locationData[0].name;
        this.phone = this.locationData[0].phone;
        this.address = this.locationData[0].address;
      } else {
        this.redirectTo({ val: "home" });
      }
    },
    async deleteCategory() {
      let result = await axios.delete(
        `http://localhost:3000/categories/${this.catId}`
      );
      let allResults = [];
      for (var i = 0; i < this.allItemsIdIs.length; i++) {
        let result = await axios.delete(
          `http://localhost:3000/items/${this.allItemsIdIs[i]}`
        );
        if (result.status == 200) {
          allResults.push(true);
        } else {
          allResults.push(false);
        }
      }
      if (result.status == 200 && !allResults.includes(false)) {
        this.ErrorMessage = "";
        this.SuccessMessage = "Category And Related Items Are Deleted";
        setTimeout(() => {
          this.$router.push({
            name: "ViewCategories",
            params: { locationId: this.locationId },
          });
        }, 2000);
      } else {
        this.SuccessMessage = "";
        this.ErrorMessage = "Something Went Wrong, Try Again";
      }
    },
    async getCategoryName(userId, locId, catId) {
      let result = await axios.get(
        `http://localhost:3000/categories?userId=${userId}&locationId=${locId}&id=${catId}`
      );
      if (result.status === 200) {
        this.categoryNames = result.data;
        if (this.categoryNames.length > 0) {
          this.name = this.categoryNames[0].name;
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
#nav {
  margin: 5px 0 0 0;
}
</style>
