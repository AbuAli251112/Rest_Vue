<template>
  <div class="container">
    <Navbar />
    <form @click.prevent>
      <div class="col-auto d-block mx-auto">
        <h1 class="text-center">Update Your Profile</h1>
      </div>
      <div class="row p-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <input
            type="text"
            class="form-control"
            placeholder="Enter Your Name"
            disabled
            v-model="name"
          />
        </div>
      </div>
      <div class="row p-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <input
            type="email"
            class="form-control"
            placeholder="Enter Your Email"
            disabled
            v-model="email"
          />
        </div>
      </div>
      <div class="row p-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <input
            type="password"
            class="form-control"
            placeholder="Enter Your Password"
            disabled
            v-model="pass"
          />
        </div>
      </div>
      <div class="row p-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <button type="submit" @click="updateProfie()" class="btn btn-primary">
            Update Profile Now
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import Navbar from "../Header/Navbar.vue";
import { mapActions } from "vuex";
export default {
  name: "ProfileForm",
  components: { Navbar },
  data: () => {
    return {
      name: "",
      email: "",
      pass: "",
    };
  },
  mounted() {
    let user = localStorage.getItem("user-info");
    if (user) {
      this.name = JSON.parse(user).name;
      this.email = JSON.parse(user).email;
      this.pass = JSON.parse(user).pass;
    } else {
      this.redirectTo({ val: "login" });
    }
  },
  methods: {
    ...mapActions(["redirectTo"]),
    updateProfie() {
      this.redirectTo({ val: "UpdateProfile" });
    },
  },
};
</script>

<style lang="scss" scoped>
ul {
  padding-left: 0;
  margin-bottom: 20px;
}
</style>
