<template>
  <v-container class="black-background">
    <!-- shows the result of the payment method logic -->
    <v-row v-if="orderDetails" class="d-flex justify-center align-center">
      <v-col cols="12" sm="6" md="4">
        <h3>Detalhes do Pedido</h3>
        <p v-if="orderDetails.success">
          Status do Pedido:
          <span v-if="orderDetails.paymentMethod === 'Pix'"
            >Aguardando pagamento</span
          >
          <span v-else-if="orderDetails.paymentMethod === 'Boleto'"
            >Aguardando pagamento</span
          >
          <span v-else>Pagamento realizado</span>
        </p>
        <p v-else>Status do Pedido: Falhou</p>
        <template v-if="orderDetails.success">
          <p>Nome: {{ orderDetails.name }}</p>
          <p>Email: {{ orderDetails.email }}</p>
          <p>Telefone: {{ orderDetails.phone }}</p>
          <p>CEP: {{ orderDetails.cep }}</p>
          <p>Endereço: {{ orderDetails.address }}</p>
          <p v-if="orderDetails.paymentMethod !== 'Cartão de Crédito'">
            {{ orderDetails.paymentMethod }} Código:
            {{ orderDetails.paymentCode }}
          </p>
          <p v-if="orderDetails.paymentMethod === 'Cartão de Crédito'">
            Status de Pagamento: Pagamento realizado
          </p>
          <!--Displays image of the Pix QR Code and Boleto Bank barcode-->
          <v-img
            v-if="orderDetails.paymentMethod === 'Pix'"
            src="../assets/qrcode.png"
            alt="QR Code"
            aspect-ratio="1"
            max-width="300px"
          ></v-img>
          <v-img
            v-if="orderDetails.paymentMethod === 'Boleto'"
            src="../assets/codbarras.png"
            alt="Código de Barras"
            aspect-ratio="4"
            min-width="900px"
          ></v-img>
        </template>
        <!--error message by cpf or success-->
        <p v-if="!orderDetails.success && orderDetails.errorMsg">
          {{ orderDetails.errorMsg }}
        </p>
        <template
          v-if="
            orderDetails.errorMsg === 'CPF inválido. Pedido não autorizado.'
          "
        >
          <p>CPF: {{ orderDetails.cpf }}</p>
          <p>Status de Pagamento: Pagamento não realizado</p>
        </template>
      </v-col>
    </v-row>
    <!--Displays offer information-->
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
    <!-- Order form -->
    <v-sheet v-if="!orderDetails" class="mx-auto" color="black" width="575">
      <v-form @submit.prevent="validateForm">
        <v-text-field
          v-model="name"
          :error-messages="nameError"
          label="Nome Completo"
          aria-label="Nome Completo"
        ></v-text-field>
        <v-text-field
          v-model="email"
          :error-messages="emailError"
          label="Email"
          aria-label="Email"
        ></v-text-field>
        <v-text-field
          v-model="phone"
          :error-messages="phoneError"
          label="Telefone"
          aria-label="Telefone"
        ></v-text-field>
        <v-text-field
          v-model="cep"
          :error-messages="cepError"
          label="CEP"
          @change="fetchAddress"
          aria-label="CEP"
        ></v-text-field>
        <v-text-field
          v-model="address"
          :error-messages="addressError"
          label="Endereço"
          aria-label="Endereço"
        ></v-text-field>
        <v-select
          v-model="paymentMethod"
          :items="paymentMethods"
          :error-messages="paymentMethodError"
          label="Método de Pagamento"
          aria-label="Método de Pagamento"
        ></v-select>
        <v-text-field
          v-if="paymentMethod === 'Cartão de Crédito'"
          v-model="cardNumber"
          :error-messages="cardNumberError"
          label="Número do Cartão"
          aria-label="Número do Cartão"
        ></v-text-field>
        <v-text-field
          v-if="paymentMethod === 'Cartão de Crédito'"
          v-model="cardCvv"
          :error-messages="cardCvvError"
          label="CVV"
          aria-label="CVV"
        ></v-text-field>
        <v-text-field
          v-if="paymentMethod === 'Cartão de Crédito'"
          v-model="cardExpiry"
          :error-messages="cardExpiryError"
          label="Data de Validade (MM/AA)"
          aria-label="Data de Validade (MM/AA)"
        ></v-text-field>
        <v-text-field
          v-model="cpf"
          :error-messages="cpfError"
          label="CPF"
          aria-label="CPF"
          @input="formatCpf"
        ></v-text-field>
        <!-- Button to submit the form -->
        <div class="d-flex justify-center">
          <v-btn type="submit" variant="outlined">Realizar Pedido</v-btn>
        </div>
      </v-form>
    </v-sheet>
  </v-container>
</template>

<script>
// axios do requests http
import axios from "axios";

export default {
  name: "CheckoutPage",
  // the data is stored the variables
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
      qrCodeImage: "/path/to/qr-code.png",
      barcodeImage: "/path/to/barcode.png",
    };
  },
  mounted() {
    //search offer details when assembling the component
    this.fetchOffer();
  },
  methods: {
    // Function to search the offer details
    async fetchOffer() {
      try {
        const response = await axios.get(`http://localhost:3000/OfferCode`);
        this.offer = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    // Function to search for address based on zip code
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
            if (response.data.logradouro) {
              this.address = `${response.data.logradouro}, ${response.data.bairro}, ${response.data.localidade} - ${response.data.uf}`;
              this.addressError = "";
            } else {
              this.addressError =
                "Endereço não encontrado para o CEP informado.";
              this.address = "";
            }
          }
        } catch (error) {
          this.addressError = "Falha ao buscar o endereço.";
          this.address = "";
        }
      } else {
        this.address = "";
      }
    },
    // Function to validate the form with regex
    validateForm() {
      this.nameError = !this.name
        ? "Nome completo é obrigatório."
        : !/^[a-zA-ZÀ-ÿ\s]{2,}$/.test(this.name)
        ? "Nome deve conter apenas letras, sem números."
        : "";
      this.emailError =
        this.email && !this.email.includes("@") ? "Email inválido." : "";
      this.phoneError =
        !this.phone || !/^\(\d{2}\) \d{5}-\d{4}$/.test(this.phone)
          ? "Número de telefone inválido. Formato esperado: (99) 99999-9999."
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

      if (this.paymentMethod === "Cartão de Crédito") {
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
      // If there are no errors, submit the request
      if (!this.hasErrors()) {
        this.submitOrder();
      }
    },
    // Function to submit the request
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
      try {
        const response = await axios.post(
          `http://localhost:3000/orders`,
          formData
        );
        if (/^0{11}$/.test(this.cpf)) {
          this.orderDetails = {
            success: false,
            errorMsg: "CPF inválido. Pedido não autorizado.",
            name: this.name,
            email: this.email,
            phone: this.phone,
            cep: this.cep,
            address: this.address,
            paymentMethod: this.paymentMethod,
            cpf: this.cpf,
          };
        } else {
          this.handleOrderResponse(response);
        }
      } catch (error) {
        this.orderDetails = {
          success: false,
          errorMsg: "Erro ao processar o pedido. Tente novamente mais tarde.",
        };
      }
    },
    // Function to handle the request response
    handleOrderResponse(response) {
      if (response.status === 201) {
        this.orderDetails = { success: true, ...response.data };
      } else {
        this.orderDetails = {
          success: false,
          errorMsg:
            response.data.errorMsg || "Erro desconhecido ao realizar o pedido.",
        };
      }
    },
    // Function to check the form for errors
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
    // Function to format the CPF by removing non-numeric characters
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
