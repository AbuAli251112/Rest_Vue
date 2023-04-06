<template>
  <form @click.prevent>
    <div class="row g-3 align-items-center">
      <div class="col-auto d-block mx-auto">
        <h1>Login</h1>
        <div
          class="form-floating mb-3"
          :class="{ 'form-group-error': v$.email.$error }"
        >
          <input
            type="email"
            class="w250 form-control"
            id="floatEmailIs"
            placeholder="Your Email Is"
            v-model.trim="state.email"
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
            v-model.trim="state.pass"
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
        <button type="submit" @click="userLogin()" class="w250 btn btn-success">
          Login
        </button>
      </div>
    </div>
    <div class="row g-3 align-items-center mb-3">
      <div class="col-auto d-block mx-auto">
        <button
          type="button"
          @click="redirectTo({ val: 'Signup' })"
          class="w250 btn btn-primary"
        >
          Don't Have Account, Sign Up
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
import { required, email } from "@vuelidate/validators";
import { reactive, computed } from "vue";
export default {
  name: "LoginForm",
  setup() {
    const state = reactive({
      pass: "",
      email: "",
    });
    const rules = computed(() => {
      return {
        email: { required, email },
        pass: { required },
      };
    });
    const v$ = useValidate(rules, state);
    return {
      state,
      v$,
    };
  },
  data() {
    return {
      userNotFoundErr: "",
      successMessage: "",
      errorMessage: "",
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
    async userLogin() {
      this.v$.$validate();
      if (!this.v$.$error) {
        console.log("Form Validated Successfully");
        let result = await axios.get(
          `http://localhost:3000/users?email=${this.state.email}&pass=${this.state.pass}`
        );
        if (result.status == 200 && result.data.length > 0) {
          localStorage.setItem("user-info", JSON.stringify(result.data[0]));
          this.successMessage = "Loading ...";
          this.errorMessage = "";
          setTimeout(() => {
            this.redirectTo({ val: "home" });
          }, 2000);
        } else {
          this.successMessage = "";
          this.errorMessage = "User Is Invalid!";
        }
      } else {
        this.successMessage = "";
        this.errorMessage = "Must Enter Email and Pass!";
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
