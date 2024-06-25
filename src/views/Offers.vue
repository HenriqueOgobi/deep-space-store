<template>
  <v-container class="d-flex justify-center">
    <v-card
      class="d-flex flex-column justify-end align-end"
      color="surface-variant"
      image="https://cdn.vuetifyjs.com/images/cards/cooking.png"
      min-width="1320"
      min-height="1130"
    >
      <v-card-title class="text-right">{{ offer.name }}</v-card-title>
      <v-card-subtitle class="text-right text-color">{{ offer.subtitle }}</v-card-subtitle>
      <template v-slot:actions>
        <router-view></router-view>
        <router-link :to="`/CheckoutPage`">
          <v-btn
            class="mb-6 bg-surface-variant"
            append-icon="mdi-chevron-right"
            text="Compre o café aqui!"
            variant="outlined"
          ></v-btn>
        </router-link>
      </template>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "Offers",
  data() {
    return {
      offerCode: this.$route.params.id,
      offer: {},
    };
  },
  mounted() {
    fetch("http://localhost:3000/OfferCode")
      .then((resp) => resp.json())
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
