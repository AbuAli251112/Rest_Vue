<template>
  <div class="container">
    <Navbar />
    <p class="text-end">
      Welcome {{ userName }}
      <router-link :to="{ name: 'profile' }">
        <button class="btn btn-info">Profile</button>
      </router-link>
    </p>
    <router-link :to="{ name: 'AddNewLocation' }">
      <button type="button" class="btn btn-primary">Add New Restaurant</button>
    </router-link>
    <UserLocations :allLocations="ListOfLocations" />
  </div>
</template>

<script>
import Navbar from "@/components/Header/Navbar.vue";
import { mapActions } from "vuex";
import axios from "axios";
import UserLocations from "@/components/Locations/UserLocations.vue";
export default {
  name: "HomeView",
  data: () => {
    return {
      userName: "",
      userId: "",
      ListOfLocations: [],
    };
  },
  async mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.redirectTo({ val: "signup" });
    } else {
      this.userName = JSON.parse(user).name;
      this.userId = JSON.parse(user).id;
    }
    let result = await axios.get(
      `http://localhost:3000/locations?userId=${this.userId}`
    );
    if (result.status === 200 && result.data.length > 0) {
      this.ListOfLocations = result.data;
    }
  },
  methods: {
    ...mapActions(["redirectTo"]),
  },
  components: { Navbar, UserLocations },
};
</script>
