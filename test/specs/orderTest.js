describe("Order Submission Test", () => {
  it("should successfully submit an order and show the thank you page", async () => {
    // search on api
    await browser.url("http://localhost:8080/CheckoutPage");

    // wait page load
    await browser.pause(5000);

    // search field Nome completo
    const nomeCompletoField = await $('[aria-label="Nome Completo"]');
    await nomeCompletoField.waitForExist({ timeout: 5000 });

    // fill the fields
    await nomeCompletoField.setValue("Henrique Gobi");

    const emailField = await $('[aria-label="Email"]');
    await emailField.setValue("henrique.gobi@example.com");

    const phoneField = await $('[aria-label="Telefone"]');
    await phoneField.setValue("(99) 99999-9999");

    const cepField = await $('[aria-label="CEP"]');
    await cepField.setValue("53427650");
    const body = await $("body");
    await body.click(); //body click for fill endrees field
    await browser.pause(2000);

    const paymentMethodField = await $('[aria-label="Método de Pagamento"]');
    await paymentMethodField.scrollIntoView();
    await paymentMethodField.waitForExist({ timeout: 5000 });

    await browser.execute(function () {
      const field = document.querySelector(
        '[aria-label="Método de Pagamento"]'
      );
      field.scrollIntoView();
    });

    await paymentMethodField.click();

    const opcaoCartaoCredito = await $(
      '//div[contains(text(),"Cartão de Crédito")]'
    );
    await opcaoCartaoCredito.waitForExist({ timeout: 5000 });

    await opcaoCartaoCredito.click();

    const cardNumberField = await $('[aria-label="Número do Cartão"]');
    await cardNumberField.waitForExist({ timeout: 5000 });
    await cardNumberField.setValue("4111 1111 1111 1111");

    const cardCvvField = await $('[aria-label="CVV"]');
    await cardCvvField.setValue("123");

    const cardExpiryField = await $('[aria-label="Data de Validade (MM/AA)"]');
    await cardExpiryField.setValue("12/24");

    const cpfField = await $('[aria-label="CPF"]');
    await cpfField.setValue("12345678900");

    const submitButton = await $('button[type="submit"]');
    await submitButton.waitForExist({ timeout: 10000 });
    await submitButton.click();

    //show details
    const thankYouHeader = await $("h3");
    await thankYouHeader.waitForExist({ timeout: 10000 });
    await expect(thankYouHeader).toBeDisplayed();
    await expect(thankYouHeader).toHaveText("Detalhes do Pedido");
    const orderStatus = await $("p");
    await orderStatus.waitForExist({ timeout: 10000 });
    await expect(orderStatus).toHaveTextContaining(
      "Status do Pedido: Pagamento realizado"
    );
  });
});
