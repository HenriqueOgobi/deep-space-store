describe("My Login application", () => {
  it("should login with valid credentials", async () => {
    await browser.url("https://the-internet.herokuapp.com/login");

    await $("#username").setValue("tomsmith");
    await $("#password").setValue("SuperSecretPassword!");
    await $('button[type="submit"]').click();

    const flash = await $("#flash");
    await expect(flash).toBeDisplayed();
    await expect(flash).toHaveTextContaining("You logged into a secure area!");
  });
});
