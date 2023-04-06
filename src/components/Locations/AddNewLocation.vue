<template>
  <Navbar />
  <div class="row align-items-center">
    <div class="col-auto d-block mx-auto">
      <h1>Add New Restaurant</h1>
    </div>
  </div>
  <form @click.prevent>
    <div class="row p-3 align-items-center">
      <div class="col-auto d-block mx-auto">
        <input
          type="text"
          class="form-control"
          placeholder="Restaurant Name:"
          v-model.trim="state.name"
        />
        <span class="error-feedback" v-if="v$.name.$error">{{
          v$.name.$errors[0].$message
        }}</span>
      </div>
    </div>
    <div class="row p-3 align-items-center">
      <div class="col-auto d-block mx-auto">
        <input
          type="text"
          class="form-control"
          placeholder="Phone Number:"
          v-model.trim="state.phone"
        />
        <span class="error-feedback" v-if="v$.phone.$error">{{
          v$.phone.$errors[0].$message
        }}</span>
      </div>
    </div>
    <div class="row p-3 align-items-center">
      <div class="col-auto d-block mx-auto">
        <input
          type="text"
          class="form-control"
          placeholder="Restaurant Address:"
          v-model.trim="state.address"
        />
        <span class="error-feedback" v-if="v$.address.$error">{{
          v$.address.$errors[0].$message
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
  </form>
  <div class="row p-3 align-items-center">
    <div class="col-auto d-block mx-auto">
      <button type="button" @click="addLocation()" class="btn btn-primary">
        Add Now
      </button>
    </div>
  </div>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import { required, minLength } from "@vuelidate/validators";
import { reactive, computed } from "vue";
import { mapActions } from "vuex";
import axios from "axios";
import Navbar from "../Header/Navbar.vue";
export default {
  name: "AddNewLocation",
  setup() {
    const state = reactive({
      name: "",
      phone: "",
      address: "",
    });
    const rules = computed(() => {
      return {
        name: { required, minLength: minLength(10) },
        phone: { required, minLength: minLength(10) },
        address: { required, minLength: minLength(10) },
      };
    });
    const v$ = useVuelidate(rules, state);
    return {
      state,
      v$,
    };
  },
  data() {
    return {
      userId: "",
      ErrorMessage: "",
      SuccessMessage: "",
    };
  },
  components: {
    Navbar,
  },
  mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.redirectTo({ val: "login" });
    } else {
      this.userId = JSON.parse(user).id;
    }
  },
  methods: {
    ...mapActions(["redirectTo"]),
    async addLocation() {
      this.v$.$validate();
      if (!this.v$.$error) {
        let result = await axios.post("http://127.0.0.1:3000/locations", {
          name: this.state.name,
          phone: this.state.phone,
          address: this.state.address,
          userId: this.userId,
        });
        if (result.status == 201) {
          this.ErrorMessage = "";
          this.SuccessMessage = "Added New Location";
          setTimeout(() => {
            this.redirectTo({ val: "home" });
          }, 2000);
        } else {
          this.SuccessMessage = "";
          this.ErrorMessage = "Something Went Wrong, Try Again";
        }
      } else {
        this.SuccessMessage = "";
        this.ErrorMessage = "Validations Error";
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
#nav {
  margin: 5px 0 0 0;
}
</style>
