import { createRouter, createWebHistory } from "vue-router";
import Offers from "@/views/Offers.vue";
import CheckoutPage from "@/views/CheckoutPage.vue";

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
const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;
