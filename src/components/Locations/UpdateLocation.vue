<template>
  <div class="container">
    <Navbar />
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
        <button type="button" @click="updateLocation()" class="btn btn-primary">
          Update Now
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, computed } from "vue";
import Navbar from "../Header/Navbar.vue";
import { required, minLength } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import { mapActions } from "vuex";
import axios from "axios";

export default {
  name: "UpdateLocation",
  components: { Navbar },
  data() {
    return {
      userId: "",
      ErrorMessage: "",
      SuccessMessage: "",
      locationId: "",
      locationData: "",
    };
  },
  mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.redirectTo({ val: "login" });
    } else {
      this.userId = JSON.parse(user).id;
      this.locationId = this.$route.params.locationId;
      this.canCurrentUserAccessThisLocation();
    }
  },
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
  methods: {
    ...mapActions(["redirectTo"]),
    async canCurrentUserAccessThisLocation() {
      let result = await axios.get(
        `http://localhost:3000/locations?id=${this.locationId}&userId=${this.userId}`
      );
      if ((result.status === 200) & (result.data.length > 0)) {
        this.locationData = result.data;
        this.state.name = this.locationData[0].name;
        this.state.phone = this.locationData[0].phone;
        this.state.address = this.locationData[0].address;
      } else {
        this.redirectTo({ val: "home" });
      }
    },
    async updateLocation() {
      this.v$.$validate();
      if (!this.v$.$error) {
        let result = await axios.put(
          `http://127.0.0.1:3000/locations/${this.locationId}`,
          {
            name: this.state.name,
            phone: this.state.phone,
            address: this.state.address,
            userId: this.userId,
          }
        );
        if (result.status == 200) {
          this.ErrorMessage = "";
          this.SuccessMessage = "Location Is Updated";
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

<style>
.error-feedback {
  color: #f00;
  font-size: 0.85em;
}
#nav {
  margin: 5px 0 0 0;
}
</style>
