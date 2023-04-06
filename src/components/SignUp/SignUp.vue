<template>
  <form @click.prevent>
    <div class="row g-3 align-items-center">
      <div class="col-auto d-block mx-auto">
        <h1>Sign Up</h1>
        <div
          class="form-floating mb-3"
          :class="{ 'form-group-error': v$.name.$error }"
        >
          <input
            type="text"
            class="w250 form-control"
            id="floatNameIs"
            placeholder="Your Name Is"
            v-model.trim="name"
          />
          <label for="floatNameIs">Your Name Is</label>
          <span class="error-feedback" v-if="v$.name.$error">{{
            v$.name.$errors[0].$message
          }}</span>
        </div>
      </div>
    </div>
    <div class="row g-3 align-items-center">
      <div class="col-auto d-block mx-auto">
        <div
          class="form-floating mb-3"
          :class="{ 'form-group-error': v$.email.$error }"
        >
          <input
            type="email"
            class="w250 form-control"
            id="floatEmailIs"
            placeholder="Your Email Is"
            v-model.trim="email"
          />
          <label for="floatEmailIs">Your Email Is</label>
          <span class="error-feedback" v-if="v$.email.$error">{{
            v$.email.$errors[0].$message
          }}</span>
        </div>
      </div>
    </div>
    <div class="row g-3 align-items-center">
      <div class="col-auto d-block mx-auto">
        <div
          class="form-floating mb-3"
          :class="{ 'form-group-error': v$.pass.$error }"
        >
          <input
            type="password"
            class="w250 form-control"
            id="floatPassIs"
            placeholder="Your Password Is"
            v-model.trim="pass"
          />
          <label for="floatPassIs">Your Password Is</label>
          <span class="error-feedback" v-if="v$.pass.$error">{{
            v$.pass.$errors[0].$message
          }}</span>
        </div>
      </div>
    </div>
    <div class="row g-3 align-items-center mb-3">
      <div class="col-auto d-block mx-auto">
        <button
          type="submit"
          @click="validateEmailBeforeSignUp()"
          class="w250 btn btn-success"
        >
          Sign Up Now
        </button>
      </div>
    </div>
    <div class="row g-3 align-items-center mb-3">
      <div class="col-auto d-block mx-auto">
        <button
          type="button"
          @click="redirectTo({ val: 'Login' })"
          class="w250 btn btn-primary"
        >
          Have an Account, Login Now
        </button>
      </div>
    </div>
    <div class="row g-3 align-items-center">
      <div
        class="col-auto d-block mx-auto alert alert-success"
        v-if="successMessage.length > 0"
      >
        {{ successMessage }}
      </div>
      <div
        class="col-auto d-block mx-auto alert alert-danger"
        v-if="errorMessage.length > 0"
      >
        {{ errorMessage }}
      </div>
    </div>
  </form>
</template>

<script>
import axios from "axios";
import { mapActions } from "vuex";
import useValidate from "@vuelidate/core";
import { required, email, minLength } from "@vuelidate/validators";
export default {
  name: "SignUpForm",
  data() {
    return {
      v$: useValidate(),
      name: "",
      pass: "",
      email: "",
      successMessage: "",
      errorMessage: "",
      userEmailExists: "",
    };
  },
  validations() {
    return {
      name: { required, minLength: minLength(10) },
      pass: { required, minLength: minLength(10) },
      email: { required, email },
    };
  },
  mounted() {
    let user = localStorage.getItem("user-info");
    if (user) {
      this.redirectTo({ val: "home" });
    }
  },
  methods: {
    ...mapActions(["redirectTo"]),
    LoginPage() {
      this.$router.push({ name: "Login" });
    },
    async validateEmailBeforeSignUp() {
      let res = await axios.get(
        `http://localhost:3000/users?email=${this.email}`
      );
      if (res.status == 200) {
        this.userEmailExists = res.data;
        if (this.userEmailExists.length != 1) {
          this.successMessage = "";
          this.errorMessage = "";
          this.signUpNow();
        } else {
          this.successMessage = "";
          this.errorMessage = "This email already exists..";
        }
      }
    },
    async signUpNow() {
      this.v$.$validate();
      if (!this.v$.$error) {
        console.log("Form Validated Successfully");
        let result = await axios.post("http://localhost:3000/users", {
          name: this.name,
          email: this.email,
          pass: this.pass,
        });
        if (result.status == 201) {
          console.log("Added New User Successfully");
          localStorage.setItem("user-info", JSON.stringify(result.data));
          console.log(result);
          console.log(JSON.stringify(result.data));
          this.successMessage = "Loading ...";
          this.errorMessage = "";
          setTimeout(() => {
            this.redirectTo({ val: "home" });
          }, 2000);
        } else {
          this.successMessage = "";
          this.errorMessage = "Something went wrong, try again!";
        }
      } else {
        this.successMessage = "";
        this.errorMessage = "Must Fill in all Fields!";
      }
    },
  },
};
</script>

<style></style>
