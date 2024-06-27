//import routes and import funcionalitys 
import { createRouter, createWebHistory } from "vue-router";
import Offers from "@/views/Offers.vue";
import CheckoutPage from "@/views/CheckoutPage.vue";

//named routes
const routes = [
  {
    path: "/",
    name: "Offers",
    component: Offers,
  },
  {
    path: "/CheckoutPage",
    name: "CheckoutPage",
    component: CheckoutPage,
  },
];
// create routes
const router = createRouter({
  history: createWebHistory(),
  routes,
});
//export routs
export default router;
