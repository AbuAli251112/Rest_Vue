<template>
  <Navbar />
  <div class="container">
    <router-link
      :to="{ name: 'ViewCategories', params: { locationId: locationId } }"
    >
      <button class="btn btn-info">Back To Category</button> </router-link
    >&nbsp;&nbsp;
    <router-link :to="{ name: 'Menu', params: { locationId: locationId } }">
      <button class="btn btn-success">Back To Menu</button>
    </router-link>
    <br />
    <div class="text-center">
      <h1>{{ locName }}</h1>
      <p class="text-muted">{{ locAddress }}</p>
    </div>
    <form @click.prevent>
      <div class="row align-items-center">
        <div class="col-auto d-block mx-auto">
          <h1>Update Category</h1>
        </div>
      </div>
      <div class="row p-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <input
            type="text"
            class="form-control"
            placeholder="Add Category Name:"
            v-model.trim="name"
          />
          <span class="error-feedback" v-if="v$.name.$error">{{
            v$.name.$errors[0].$message
          }}</span>
        </div>
      </div>
      <br />
      <div class="row align-items-center">
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
      <div class="row p-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <button
            type="button"
            @click="updateCategory()"
            class="btn btn-success"
          >
            Update Now
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import Navbar from "../Header/Navbar.vue";
import { mapActions, mapMutations } from "vuex";
import axios from "axios";
import useValidate from "@vuelidate/core";
import { required, minLength, maxLength } from "@vuelidate/validators";

export default {
  name: "AddNewCategory",
  components: {
    Navbar,
  },
  data() {
    return {
      v$: useValidate(),
      locationId: this.$route.params.locationId,
      catId: this.$route.params.catId,
      userId: "",
      locName: "",
      locAddress: "",
      name: "",
      SuccessMessage: "",
      ErrorMessage: "",
      listOfUserCategories: [],
      categoryNames: [],
    };
  },
  validations() {
    return {
      name: { required, minLength: minLength(3), maxLength: maxLength(15) },
    };
  },
  async mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.redirectTo({ val: "signup" });
    } else {
      this.userName = JSON.parse(user).name;
      this.userId = JSON.parse(user).id;
      this.canUserAccessThisLocation({
        userIdIs: this.userId,
        locationIdIs: this.locationId,
        redirectToPage: "home",
      });
      this.canUserAccessThisCategory({
        userIdIs: this.userId,
        catIdIs: this.catId,
        locationIdIs: this.locationId,
        redirectToPage: "home",
      });
      this.getLocationInfo(this.userId, this.locationId);
      this.displayUserCategories(this.userId, this.locationId);
      this.getCategoryName(this.userId, this.locationId, this.catId);
    }
  },
  methods: {
    ...mapActions(["redirectTo"]),
    ...mapMutations([
      "isLoggedInUser",
      "displayAllCategories",
      "canUserAccessThisLocation",
      "canUserAccessThisCategory",
    ]),
    async getLocationInfo(id, locId) {
      let result = await axios.get(
        `http://localhost:3000/locations?userId=${id}&id=${locId}`
      );
      let locDetails = [];
      if (result.status === 200 && result.data.length > 0) {
        locDetails = result.data;
        this.locName = locDetails[0].name;
        this.locAddress = locDetails[0].address;
      }
    },
    async updateCategory() {
      this.v$.$validate();
      let filterCategoryName = this.listOfUserCategories.filter(
        (v) => v.name.toLocaleLowerCase() == this.name.toLocaleLowerCase()
      );
      if (!this.v$.$error) {
        if (filterCategoryName.length > 0) {
          this.ErrorMessage = "Category Name Already Exists, Try Another Name";
          this.SuccessMessage = "";
        } else {
          let result = await axios.put(
            `http://localhost:3000/categories/${this.catId}`,
            {
              name: this.name,
              userId: this.userId,
              locationId: parseInt(this.locationId),
            }
          );
          if (result.status === 200) {
            this.ErrorMessage = "";
            this.SuccessMessage = "Updated Category Name Successfully";
            setTimeout(() => {
              this.$router.push({
                name: "ViewCategories",
                params: { locationId: this.locationId },
              });
            }, 2000);
          } else {
            this.SuccessMessage = "";
            this.ErrorMessage = "Something Went Wrong Try Again";
          }
        }
      } else {
        this.SuccessMessage = "";
        this.ErrorMessage = "You Must Fall In Category Name";
      }
    },
    async displayUserCategories(userId, locId) {
      let result = await axios.get(
        `http://localhost:3000/categories?userId=${userId}&locationId=${locId}`
      );
      if (result.status === 200) {
        this.listOfUserCategories = result.data;
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

<style></style>
