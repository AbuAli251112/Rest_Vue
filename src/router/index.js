import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import SignUpView from "../views/SignUpView.vue";
import LoginView from "../views/LoginView.vue";
import ProfileView from "../views/ProfileView.vue";
import UpdateProfile from "../components/Profile/UpdateProfile.vue";
import ErrorView from "../views/ErrorView.vue";
import AddNewLocation from "../components/Locations/AddNewLocation.vue";
import DeleteLocation from "../components/Locations/DeleteLocation.vue";
import DeleteAllLocations from "../components/Locations/DeleteAllLocations.vue";
import UpdateLocation from "../components/Locations/UpdateLocation.vue";
import Menu from "../components/Menu/Menu.vue";
import AddNewCategory from "../components/Menu/AddNewCategory.vue";
import ViewCategories from "../components/Menu/ViewCategories.vue";
import UpdateCategory from "../components/Menu/UpdateCategory.vue";
import DeleteCategory from "../components/Menu/DeleteCategory.vue";
import DeleteAllCategories from "../components/Menu/DeleteAllCategories.vue";
import AddNewItem from "../components/Menu/AddNewItem.vue";
import UpdateItem from "../components/Menu/UpdateItem.vue";
import DeleteAllItems from "../components/Menu/DeleteAllItems.vue";
import DeleteItem from "../components/Menu/DeleteItem.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
  {
    path: "/signup",
    name: "signup",
    component: SignUpView,
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/profile",
    name: "profile",
    component: ProfileView,
  },
  {
    path: "/updateProfile",
    name: "UpdateProfile",
    component: UpdateProfile,
  },
  {
    path: "/addNewLocation",
    name: "AddNewLocation",
    component: AddNewLocation,
  },
  {
    path: "/deleteLocation/:locationId",
    name: "DeleteLocation",
    component: DeleteLocation,
  },
  {
    path: "/deleteAllLocations",
    name: "DeleteAllLocations",
    component: DeleteAllLocations,
  },
  {
    path: "/updateLocation/:locationId",
    name: "UpdateLocation",
    component: UpdateLocation,
  },
  {
    path: "/menu/location/:locationId",
    name: "Menu",
    component: Menu,
  },
  {
    path: "/menu/categories/add/:locationId",
    name: "AddNewCategory",
    component: AddNewCategory,
  },
  {
    path: "/menu/categories/view/:locationId",
    name: "ViewCategories",
    component: ViewCategories,
  },
  {
    path: "/menu/categories/update/:locationId/:catId",
    name: "UpdateCategory",
    component: UpdateCategory,
  },
  {
    path: "/menu/categories/delete/loc/:locationId/item/:catId",
    name: "DeleteCategory",
    component: DeleteCategory,
  },
  {
    path: "/menu/categories/delete/all/:locationId",
    name: "DeleteAllCategories",
    component: DeleteAllCategories,
  },
  {
    path: "/menu/item/add/:locationId",
    name: "AddNewItem",
    component: AddNewItem,
  },
  {
    path: "/menu/item/update/:itemId/loc/:locationId",
    name: "UpdateItem",
    component: UpdateItem,
  },
  {
    path: "/menu/items/delete-all/:locationId",
    name: "DeleteAllItems",
    component: DeleteAllItems,
  },
  {
    path: "/menu/item/:itemId/delete/loc/:locationId",
    name: "DeleteItem",
    component: DeleteItem,
  },
  {
    path: "/:catchAll(.*)",
    name: "ErrorPage",
    component: ErrorView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  document.title = to.name;
  if (to.params.pageTitle !== undefined) {
    document.title = `${to.name} | ${to.params.pageTitle} | ${process.env.VUE_APP_TITLE}`;
  } else {
    if (to.name == null) {
      document.title = `Unknown Page | ${process.env.VUE_APP_TITLE}`;
    } else {
      document.title = `${to.name} | ${process.env.VUE_APP_TITLE}`;
    }
  }
  next();
});

export default router;
