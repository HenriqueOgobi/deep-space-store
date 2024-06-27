describe("Order Submission Test", () => {
  // test
  it("should successfully submit an order and show the thank you page", async () => {
    // navigate to checkout page
    await browser.url("http://localhost:8080/CheckoutPage");
    // wait until page is fully loaded
    await browser.waitUntil(async () => await $("body").isDisplayed(), {
      timeout: 10000,
      timeoutMsg: "Expected body to be displayed after loading",
    });
    // fill fields
    await $('[aria-label="Nome Completo"]').setValue("Henrique Gobi");
    await $('[aria-label="Email"]').setValue("henrique.gobi@example.com");
    await $('[aria-label="Telefone"]').setValue("(99) 99999-9999");
    await $('[aria-label="CEP"]').setValue("53427650");
    // wait for address to be filled
    await browser.keys("Tab");
    await browser.pause(3000);

    // Dont work
    await $('[aria-label="Método de Pagamento"]').click();
    await $("=Cartão de Crédito").waitForDisplayed({ timeout: 5000 });
    await $("=Cartão de Crédito").click();

    // set number of card
    await $('[aria-label="Número do Cartão"]').setValue("4111111111111111");
    // set cvv
    await $('[aria-label="CVV"]').setValue("123");
    // set expiration date
    await $('[aria-label="Data de Validade (MM/AA)"]').setValue("12/28");
    // set cpf
    await $('[aria-label="CPF"]').setValue("12345678900");
    // submit form
    await $('button[type="submit"]').click();
    // wait for thank you page to be displayed
    await $("h3").waitForDisplayed({ timeout: 10000 });
    // check details of the order
    expect(await $("h3").getText()).toContain("Detalhes do Pedido");
    expect(await $("p").getText()).toContain(
      "Status do Pedido: Pagamento realizado"
    );
  });
});
