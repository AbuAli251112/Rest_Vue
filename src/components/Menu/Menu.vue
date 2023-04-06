<template>
  <Navbar />
  <div class="container">
    <div>
      <router-link
        :to="{ name: 'ViewCategories', params: { locationId: locationId } }"
      >
        <button type="button" class="float-start btn btn-success">
          View/Add Categories
        </button>
      </router-link>
      <router-link
        :to="{ name: 'AddNewItem', params: { locationId: locationId } }"
      >
        <button
          type="button"
          class="float-end btn btn-success"
          v-if="numOfCategories > 0"
        >
          Add New Items
        </button>
      </router-link>
    </div>
    <div class="clearfix"></div>
    <div class="text-center">
      <h1 class="mb0">{{ locName }}</h1>
      <p class="text-muted">{{ locAddress }}</p>
    </div>
    <div class="clearfix"></div>
    <router-link
      v-if="listOfCategories.length > 0"
      :to="{ name: 'DeleteAllItems', params: { locationId: locationId } }"
    >
      <button type="button" class="btn btn-danger">Delete All Items</button>
    </router-link>
    <div class="clearfix"></div>
    <br />
    <!-- <div>
      Is User Logged In? {{ isUserLoggedIn }} <br />
      User Id is {{ loggedInUserId }} <br />
      Num of Categories? {{ numOfCategories }} <br />
      Categories Array? {{ listOfCategories }}
    </div> -->
    <div class="each-category">
      <div class="" v-for="(cat, i) in listOfCategories" :key="i">
        <div class="row">
          <div class="row col-12 catName">
            <h3 class="text-center bg-light p-1">{{ cat.name }}</h3>
          </div>
          <div
            v-for="(item, h) in listOfUserItems"
            :key="h"
            v-show="cat.id == item.catId"
            :class="{
              'col-xs-12 col-sm-4 px-4': cat.id == item.catId,
              card: cat.id == item.catId,
              'p-3': cat.id == item.catId,
            }"
          >
            <div
              v-if="cat.id == item.catId"
              :class="{ 'each-item': cat.id == item.catId }"
            >
              <h4 class="item-name">{{ item.name }}</h4>
              <p class="item-description text-muted">
                {{ item.description }}
              </p>
              <div>
                <div class="available-items float-start text-muted">
                  Available Qty: {{ numberWithCommas(item.qty) }}
                </div>
                <div class="item-price float-end text-muted">
                  Price: {{ numberWithCommas(item.price) }}
                </div>
              </div>
              <div class="clearfix"></div>
              <div class="p-1 mt-2">
                <div class="available-items float-start">
                  <router-link
                    :to="{
                      name: 'UpdateItem',
                      params: { itemId: item.id, locationId: locationId },
                    }"
                  >
                    <button type="button" class="float-end btn btn-info">
                      Update
                    </button>
                  </router-link>
                </div>
                <div class="item-price float-end">
                  <router-link
                    :to="{
                      name: 'DeleteItem',
                      params: { itemId: item.id, locationId: locationId },
                    }"
                  >
                    <button type="button" class="float-end btn btn-danger">
                      Delete
                    </button>
                  </router-link>
                </div>
              </div>
              <div class="clearfix"></div>
            </div>
          </div>
        </div>
        <br />
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "@/components/Header/Navbar.vue";
import { mapActions, mapState, mapMutations } from "vuex";
import axios from "axios";
export default {
  components: { Navbar },
  name: "MenuComponent",
  data() {
    return {
      userId: "",
      userName: "",
      locationId: this.$route.params.locationId,
      locName: "",
      locAddress: "",
      listOfUserItems: [],
    };
  },
  computed: {
    ...mapState([
      "isUserLoggedIn",
      "loggedInUserId",
      "numOfCategories",
      "listOfCategories",
      "listOfLocations",
    ]),
  },
  async mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.redirectTo({ val: "Signup" });
    } else {
      this.userName = JSON.parse(user).name;
      this.userId = JSON.parse(user).id;
      this.isLoggedInUser();
      this.displayAllCategories({
        userIdIs: this.userId,
        locationIdIs: this.locationId,
      });
      this.canUserAccessThisLocation({
        userIdIs: this.userId,
        locationIdIs: this.locationId,
        redirectToPage: "home",
      });
      this.getLocationInfo(this.userId, this.locationId);
      this.getCurrentUserItems(this.userId, this.locationId);
    }
  },
  methods: {
    ...mapMutations([
      "isLoggedInUser",
      "displayAllCategories",
      "canUserAccessThisLocation",
    ]),
    ...mapActions(["redirectTo"]),
    async getCurrentUserItems(userId, locId) {
      let result = await axios.get(
        `http://localhost:3000/items?userId=${userId}&locId=${locId}`
      );
      if (result.status == 200) {
        this.listOfUserItems = result.data;
        console.table(this.listOfUserItems);
      }
    },
    numberWithCommas(n) {
      return n.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    },
    async getLocationInfo(userId, locId) {
      let result = await axios.get(
        `http://localhost:3000/locations?userId=${userId}&id=${locId}`
      );
      let locDetails = [];
      if (result.status == 200) {
        locDetails = result.data;
        if (locDetails.length > 0) {
          this.locName = locDetails[0].name;
          this.locAddress = locDetails[0].address;
        }
      }
    },
  },
};
</script>

<style>
.mb {
  margin-bottom: 0;
}
.item-description {
  padding-top: 12px;
  min-height: 100px;
}
.card {
  border: 1px solid #d0c1c1;
}
</style>
