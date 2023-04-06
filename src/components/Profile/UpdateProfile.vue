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
            v-model="name"
          />
          <span class="error-feedback" v-if="v$.name.$error">{{
            v$.name.$errors[0].$message
          }}</span>
        </div>
      </div>
      <div class="row p-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <input
            type="email"
            class="form-control"
            placeholder="Enter Your Email"
            v-model="email"
          />
          <span class="error-feedback" v-if="v$.email.$error">{{
            v$.email.$errors[0].$message
          }}</span>
        </div>
      </div>
      <div class="row p-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <input
            type="password"
            class="form-control"
            placeholder="Enter Your Password"
            v-model="pass"
          />
          <span class="error-feedback" v-if="v$.pass.$error">{{
            v$.pass.$errors[0].$message
          }}</span>
        </div>
      </div>
      <div class="row p-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <button
            type="submit"
            @click="updateProfileNow()"
            class="btn btn-primary"
          >
            Update Profile Now
          </button>
        </div>
      </div>
      <br />
      <div class="row p-3 align-items-center">
        <div class="col-auto d-block mx-auto error-feedback">
          {{ updateErr }}
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import Navbar from "../Header/Navbar.vue";
import { mapActions } from "vuex";
import useValidate from "@vuelidate/core";
import { required, email, minLength } from "@vuelidate/validators";
import axios from "axios";
export default {
  name: "UpdateProfile",
  components: { Navbar },
  data: () => {
    return {
      v$: useValidate(),
      name: "",
      email: "",
      pass: "",
      userId: "",
      updateErr: "",
    };
  },
  validations() {
    return {
      name: { required, minLength: minLength(10) },
      email: { required, email },
      pass: { required, minLength: minLength(10) },
    };
  },
  mounted() {
    let user = localStorage.getItem("user-info");
    if (user) {
      this.name = JSON.parse(user).name;
      this.email = JSON.parse(user).email;
      this.pass = JSON.parse(user).pass;
      this.userId = JSON.parse(user).id;
    } else {
      this.redirectTo({ val: "login" });
    }
  },
  methods: {
    ...mapActions(["redirectTo"]),
    async updateProfileNow() {
      this.v$.$validate();
      if (!this.v$.$error) {
        let result = await axios.put(
          `http://localhost:3000/users/${this.userId}`,
          {
            name: this.name,
            email: this.email,
            pass: this.pass,
          }
        );
        if (result.status === 200) {
          localStorage.setItem("user-info", JSON.stringify(result.data));
          this.redirectTo({ val: "profile" });
        } else {
          this.updateErr = "Something Went Wrong, Try Again";
        }
      } else {
        this.updateErr = "Something Went Wrong, Refresh The Page";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.error-feedback {
  color: #f00;
  font-size: 0.85em;
}
</style>
