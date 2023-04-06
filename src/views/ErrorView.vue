<template>
  <div class="container">
    <h1 class="text-center">Page Not Found</h1>
    <div class="text-center">
      <router-link :to="{ name: 'home' }">
        <button class="btn btn-info" @click="visitHomePage()">
          Visit Home Page
        </button>
      </router-link>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "errorView",
  methods: {
    ...mapActions(["redirectTo"]),
    visitHomePage() {
      this.redirectTo({ val: "home" });
    },
  },
};
</script>

<style></style>
