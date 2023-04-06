<template>
  <Navbar />
  <div class="container">
    <router-link
      :to="{ name: 'AddNewCategory', params: { locationId: locationId } }"
    >
      <button class="btn btn-info">Add Category</button> </router-link
    >&nbsp;&nbsp;
    <router-link :to="{ name: 'Menu', params: { locationId: locationId } }">
      <button class="btn btn-success">Back To Menu</button>
    </router-link>
    <br />
    <div class="text-center">
      <h1>{{ locName }}</h1>
      <p class="text-muted">{{ locAddress }}</p>
    </div>
    <table class="table caption-top" v-if="numOfCategories > 0">
      <caption>
        <span>List Of Categories ({{ numOfCategories }})</span>
        <span class="float-end">
          <!-- <router-link :to="{ name: 'DeleteAllCategories' }">
            <button class="btn btn-danger">Delete All</button>
          </router-link> -->
          <router-link
            :to="{
              name: 'DeleteAllCategories',
              params: { locationId: locationId },
            }"
            ><button class="btn btn-danger">Delete All</button></router-link
          >
        </span>
      </caption>
      <thead class="bg-dark text-white">
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(cat, i) in listOfCategories" :key="i">
          <th scope="row">{{ cat.name }}</th>
          <td>
            <router-link
              :to="{
                name: 'UpdateCategory',
                params: { locationId: cat.locationId, catId: cat.id },
              }"
            >
              <button class="btn btn-info">Update</button> </router-link
            >&nbsp;
            <router-link
              :to="{
                name: 'DeleteCategory',
                params: { locationId: cat.locationId, catId: cat.id },
              }"
              ><button class="btn btn-danger">Delete</button></router-link
            >
          </td>
        </tr>
      </tbody>
    </table>
    <div v-else class="alert alert-warning mt-3" role="alert">
      No Categories Added Yet!
    </div>
  </div>
</template>

<script>
import Navbar from "../Header/Navbar.vue";
import { mapActions, mapMutations, mapState } from "vuex";
import axios from "axios";

export default {
  name: "ViewCategories",
  components: {
    Navbar,
  },
  data() {
    return {
      locationId: this.$route.params.locationId || 1,
      userId: "",
      locName: "",
      locAddress: "",
    };
  },
  computed: {
    ...mapState([
      "isUserLoggedIn",
      "loggedInUserId",
      "numOfCategories",
      "listOfCategories",
    ]),
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
      this.displayAllCategories({
        userIdIs: this.userId,
        locationIdIs: this.locationId,
      });
      this.grtLocationInfo(this.userId, this.locationId);
    }
  },
  methods: {
    ...mapActions(["redirectTo"]),
    ...mapMutations([
      "isLoggedInUser",
      "displayAllCategories",
      "canUserAccessThisLocation",
    ]),
    async grtLocationInfo(id, locId) {
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
  },
};
</script>

<style></style>
