<template>
  <v-container class="d-flex justify-center">
    <!-- Card that shows the offer -->
    <v-card
      class="d-flex flex-column justify-end align-end"
      color="surface-variant"
      image="https://cdn.vuetifyjs.com/images/cards/cooking.png"
      min-width="1320"
      min-height="1130"
    >
      <v-card-title class="text-right">{{ offer.name }}</v-card-title>
      <v-card-subtitle class="text-right text-color">{{
        offer.subtitle
      }}</v-card-subtitle>
      <template v-slot:actions>
        <router-view></router-view>
        <!-- the link to the checkout page -->
        <router-link :to="`/CheckoutPage`">
          <v-btn
            class="mb-6 bg-surface-variant"
            append-icon="mdi-chevron-right"
            text="Compre sua receita aqui!"
            variant="outlined"
          ></v-btn>
        </router-link>
      </template>
    </v-card>
  </v-container>
</template>

<script>
export default {
  // Component name
  name: "Offers",
  data() {
    return {
      // Gets the offer code from the route parameters
      offerCode: this.$route.params.id,
      // Initialize the offer object
      offer: {},
    };
  },
  mounted() {
    // search the offer data when assembling the component
    fetch("http://localhost:3000/OfferCode")
      // Convert the response to JSON
      .then((resp) => resp.json())
      // Defines the offer data in the offer object
      .then((data) => (this.offer = data));
  },
};
</script>

<style>
body {
  background-color: bisque;
}

.text-color {
  color: white !important;
}
</style>
