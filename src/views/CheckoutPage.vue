<template>
  <v-container class="black-background">
    <v-row v-if="orderDetails" class="d-flex justify-center">
      <v-col cols="12" sm="6" md="4">
        <h3>Detalhes do Pedido</h3>
        <p v-if="orderDetails.success">Status do Pedido: Pagamento realizado</p>
        <p v-else>Status do Pedido: Falhou</p>
        <template v-if="orderDetails.success">
          <p>Nome: {{ orderDetails.name }}</p>
          <p>Email: {{ orderDetails.email }}</p>
          <p>Telefone: {{ orderDetails.phone }}</p>
          <p>CEP: {{ orderDetails.cep }}</p>
          <p>Endereço: {{ orderDetails.address }}</p>
          <p v-if="orderDetails.paymentMethod !== 'Credit Card'">
            {{ orderDetails.paymentMethod }} Código:
            {{ orderDetails.paymentCode }}
          </p>
          <p v-if="orderDetails.paymentMethod === 'Credit Card'">
            Status de Pagamento: Pagamento realizado
          </p>
        </template>
        <p v-if="!orderDetails.success && orderDetails.errorMsg">
          {{ orderDetails.errorMsg }}
        </p>
      </v-col>
    </v-row>

    <v-row v-if="!orderDetails" class="d-flex justify-center align-center mb-6">
      <v-col cols="15" sm="6" md="4">
        <h1>{{ offer.name }}</h1>
        <h2 class="mt-3">Preço: R${{ offer.price }}</h2>
        <v-img
          v-for="(img, index) in offer.image"
          :key="index"
          :src="img"
          aspect-ratio="1"
          max-width="600px"
          max-height="530px"
        ></v-img>
      </v-col>
    </v-row>

    <v-sheet v-if="!orderDetails" class="mx-auto" color="black" width="575">
      <v-form @submit.prevent="validateForm">
        <v-text-field
          v-model="name"
          :error-messages="nameError"
          label="Nome Completo"
        ></v-text-field>
        <v-text-field
          v-model="email"
          :error-messages="emailError"
          label="Email"
        ></v-text-field>
        <v-text-field
          v-model="phone"
          :error-messages="phoneError"
          label="Telefone"
        ></v-text-field>
        <v-text-field
          v-model="cep"
          :error-messages="cepError"
          label="CEP"
          @change="fetchAddress"
        ></v-text-field>
        <v-text-field
          v-model="address"
          :error-messages="addressError"
          label="Endereço"
        ></v-text-field>
        <v-select
          v-model="paymentMethod"
          :items="paymentMethods"
          :error-messages="paymentMethodError"
          label="Método de Pagamento"
        ></v-select>
        <v-text-field
          v-if="paymentMethod === 'Credit Card'"
          v-model="cardNumber"
          :error-messages="cardNumberError"
          label="Número do Cartão"
        ></v-text-field>
        <v-text-field
          v-if="paymentMethod === 'Credit Card'"
          v-model="cardCvv"
          :error-messages="cardCvvError"
          label="CVV"
        ></v-text-field>
        <v-text-field
          v-if="paymentMethod === 'Credit Card'"
          v-model="cardExpiry"
          :error-messages="cardExpiryError"
          label="Data de Validade (MM/AA)"
        ></v-text-field>
        <v-text-field
          v-model="cpf"
          :error-messages="cpfError"
          label="CPF"
          @input="formatCpf"
        ></v-text-field>
        <div class="d-flex justify-center">
          <v-btn type="submit" variant="outlined">Realizar Pedido</v-btn>
        </div>
      </v-form>
    </v-sheet>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  name: "CheckoutPage",
  data() {
    return {
      offerCode: this.$route.params.id,
      offer: {},
      paymentMethods: ["Boleto", "Cartão de Crédito", "Pix"],
      name: "",
      email: "",
      phone: "",
      cep: "",
      address: "",
      paymentMethod: "",
      cardNumber: "",
      cardCvv: "",
      cardExpiry: "",
      cpf: "",
      nameError: "",
      emailError: "",
      phoneError: "",
      cepError: "",
      addressError: "",
      paymentMethodError: "",
      cardNumberError: "",
      cardCvvError: "",
      cardExpiryError: "",
      cpfError: "",
      orderDetails: null,
    };
  },
  mounted() {
    fetch("http://localhost:3000/OfferCode")
      .then((resp) => resp.json())
      .then((data) => (this.offer = data));
  },
  methods: {
    async fetchOffer() {
      try {
        const response = await axios.get(
          `http://localhost:3000/OfferCode/${this.offerCode}`
        );
        this.offer = response.data;
      } catch (error) {
        console.error("Erro ao buscar oferta:", error);
      }
    },
    async fetchAddress() {
      if (this.cep.length === 8) {
        try {
          const response = await axios.get(
            `https://viacep.com.br/ws/${this.cep}/json/`
          );
          if (response.data.erro) {
            this.addressError = "CEP não encontrado.";
            this.address = "";
          } else {
            this.address = `${response.data.logradouro}, ${response.data.bairro}, ${response.data.localidade} - ${response.data.uf}`;
            this.addressError = "";
          }
        } catch (error) {
          this.addressError = "Falha ao buscar o endereço.";
          this.address = "";
        }
      }
    },
    validateForm() {
      this.nameError = !this.name
        ? "Nome completo é obrigatório."
        : !/^[a-zA-ZÀ-ÿ\s]{2,}$/.test(this.name)
        ? "Nome deve conter apenas letras, sem números."
        : "";
      this.emailError =
        this.email && !this.email.includes("@") ? "Email inválido." : "";
      this.phoneError =
        !this.phone || /^(\(?\d{2}\)?\s)?(\d{4,5}-\d{4})$/.test(this.phone)
          ? "Número de telefone inválido. Formato esperado: (99) 99999-9999 ou 99999999999."
          : "";
      this.cepError = !this.cep ? "CEP é obrigatório." : "";
      this.addressError = !this.address ? "Endereço é obrigatório." : "";
      this.paymentMethodError = !this.paymentMethod
        ? "Selecione um método de pagamento."
        : "";
      this.cpfError =
        !this.cpf || !/^(\d{3}\.\d{3}\.\d{3}-\d{2}|\d{11})$/.test(this.cpf)
          ? "CPF inválido. Deve conter exatamente 11 dígitos numéricos."
          : "";

      if (this.paymentMethod === "Credit Card") {
        this.cardNumberError = !this.cardNumber
          ? "Número do cartão é obrigatório."
          : "";
        this.cardCvvError = !this.cardCvv ? "CVV é obrigatório." : "";
        this.cardExpiryError =
          !this.cardExpiry || !/^\d{2}\/\d{2}$/.test(this.cardExpiry)
            ? "Data de validade inválida (MM/AA)."
            : "";
      } else {
        this.cardNumberError = "";
        this.cardCvvError = "";
        this.cardExpiryError = "";
      }

      if (!this.hasErrors()) {
        this.submitOrder();
      }
    },
    async submitOrder() {
      const formData = {
        name: this.name,
        email: this.email,
        phone: this.phone,
        cep: this.cep,
        address: this.address,
        paymentMethod: this.paymentMethod,
        cardNumber: this.cardNumber,
        cardCvv: this.cardCvv,
        cardExpiry: this.cardExpiry,
        cpf: this.cpf,
      };

      // Simula requisição POST para criar o pedido
      try {
        const response = await axios.post(
          `http://localhost:3000/orders`,
          formData
        );
        this.handleOrderResponse(response.data);
      } catch (error) {
        console.error("Erro ao criar o pedido:", error);
      }
    },
    handleOrderResponse(response) {
      this.orderDetails = response;
      console.log("Detalhes do pedido:", this.orderDetails);
    },
    hasErrors() {
      return (
        this.nameError ||
        this.emailError ||
        this.phoneError ||
        this.cepError ||
        this.addressError ||
        this.paymentMethodError ||
        this.cardNumberError ||
        this.cardCvvError ||
        this.cardExpiryError ||
        this.cpfError
      );
    },
    formatCpf() {
      this.cpf = this.cpf.replace(/[^\d]/g, "");
    },
  },
};
</script>

<style scoped>
.black-background {
  background-color: #000;
  color: #fff;
  border-radius: 20px;
}
</style>