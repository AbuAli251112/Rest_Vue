<template>
  <div class="container">
    <Navbar />
    <form @click.prevent>
      <div class="clearfix"></div>
      <router-link :to="{ name: 'Menu', params: { locationId: locationId } }">
        <button type="button" class="float-start btn btn-info">
          Back to Menu
        </button>
      </router-link>
      <div class="clearfix"></div>
      <div class="row g-3 align-items-center">
        <div class="col-auto mx-auto d-block">
          <div class="clearfix"></div>
          <div class="text-center">
            <h1 class="mb0">{{ locName }}</h1>
            <p class="text-muted">{{ locAddress }}</p>
          </div>
          <div class="clearfix"></div>
          <p class="text-danger">Are you sure you want to delete this Item?</p>
          <h4>Item Name: {{ itemName }}</h4>
          <hr />
        </div>
      </div>
      <div class="row g-3 align-items-center">
        <div class="col-auto mx-auto d-block">
          <button class="btn btn-info" @click="goBack()">Go Back</button>
          &nbsp;&nbsp;&nbsp;
          <button class="btn btn-danger" @click="deleteItem()">
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
import { mapActions, mapMutations } from "vuex";
import axios from "axios";
export default {
  name: "DeleteItem",
  components: {
    Navbar,
  },
  data() {
    return {
      locationId: this.$route.params.locationId,
      itemId: this.$route.params.itemId,
      userId: "",
      locationData: [],
      successMessage: "",
      errorMessage: "",
      locName: "",
      locAddress: "",
      allItemsIdIs: [],
      pickedCategory: "",
      itemName: "",
      description: "",
      itemsQty: 1,
      itemPrice: "",
    };
  },
  async mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.redirectTo({ val: "Signup" });
    } else {
      this.userId = JSON.parse(user).id;
      this.canCurrentUserAccessThisLocation();
      this.canUserAccessThisItem({
        userIdIs: this.userId,
        locationIdIs: this.locationId,
        itemIdIs: this.itemId,
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
      this.getItemInfo(this.userId, this.locationId, this.itemId);
    }
  },
  methods: {
    ...mapMutations(["canUserAccessThisItem"]),
    ...mapActions(["redirectTo"]),
    goBack() {
      this.$router.push({
        name: "Menu",
        params: { locationId: this.locationId },
      });
    },
    async getItemInfo(userId, locId, itemId) {
      let result = await axios.get(
        `http://localhost:3000/items?userId=${userId}&locId=${locId}&id=${itemId}`
      );
      let resultData = result.data[0];
      if (result.status == 200) {
        this.description = resultData.description;
        this.itemName = resultData.name;
        this.itemsQty = resultData.qty;
        this.itemPrice = resultData.price;
        this.pickedCategory = resultData.catId;
      }
    },
    async getCategoryName(userId, locId, catId) {
      let result = await axios.get(
        `http://localhost:3000/categories?userId=${userId}&locationId=${locId}&id=${catId}`
      );
      if (result.status == 200) {
        this.categoryNames = result.data;
        if (this.categoryNames.length > 0) {
          this.name = this.categoryNames[0].name;
        }
      }
    },
    async canCurrentUserAccessThisLocation() {
      let result = await axios.get(
        `http://localhost:3000/locations?id=${this.locationId}&userId=${this.userId}`
      );
      if (result.status == 200 && result.data.length > 0) {
        this.locationData = result.data;
        this.locName = this.locationData[0].name;
        this.locAddress = this.locationData[0].address;
      } else {
        this.redirectTo({ val: "home" });
      }
    },
    async deleteItem() {
      let result = await axios.delete(
        `http://localhost:3000/items/${this.itemId}`
      );
      if (result.status == 200) {
        this.successMessage = "Item is deleted ...";
        this.errorMessage = "";
        setTimeout(() => {
          this.$router.push({
            name: "Menu",
            params: { locationId: this.locationId },
          });
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
