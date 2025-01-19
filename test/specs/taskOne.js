//@ts-check
import { expect, browser, $ } from "@wdio/globals";
import { Login } from '../pageobjects/authorization.js';

describe("My Login application", () => {
  let login;

  before(() => {
      login = new Login(); // Initialize the Login class
  });

  it("Valid Login", async () => {
    const wareImage = $$('//img[@class = "inventory_item_img"]');
    await login.navigateTo();
    await login.enterData('standard_user', 'secret_sauce');

    await expect(browser).toHaveUrl("https://www.saucedemo.com/inventory.html");
    for await (const img of wareImage) {
      await expect(img).toBeDisplayed();
    }
  });

  it("Login with invalid password", async () => {
    await login.navigateTo();
    await login.enterData('standard_user', 'incorrect_password');
    const cruciate = $$('div.form_group svg[data-icon="times-circle"]');
    const errorH3 = $('h3[data-test="error"]');

    for await (const img of cruciate) {
      await expect(img).toBeDisplayed();
    }
    await expect(login.userName).toHaveAttribute(
      "class",
      "input_error form_input error"
    );
    await expect(login.password).toHaveAttribute(
      "class",
      "input_error form_input error"
    );
    await expect(errorH3).toHaveText(
      "Epic sadface: Username and password do not match any user in this service"
    );
  });

  it("Login with invalid login", async () => {
    await login.navigateTo();
    await login.enterData('incorrect_user', 'secret_sauce');
    const cruciate = $$('div.form_group svg[data-icon="times-circle"]');
    const errorH3 = $('h3[data-test="error"]');

    for await (const img of cruciate) {
      await expect(img).toBeDisplayed();
    }
    await expect(login.userName).toHaveAttribute(
      "class",
      "input_error form_input error"
    );
    await expect(login.password).toHaveAttribute(
      "class",
      "input_error form_input error"
    );
    await expect(errorH3).toHaveText(
      "Epic sadface: Username and password do not match any user in this service"
    );
  });

  it("Logout", async () => {
    await login.navigateTo();
    await login.enterData('standard_user', 'secret_sauce');
    const buttonBurger = $("#react-burger-menu-btn");
    const sidebar = $(".bm-menu-wrap");
    const inventorySidebarLink = $("#inventory_sidebar_link");
    const aboutSidebarLink = $("#about_sidebar_link");
    const logoutSidebarLink = $("#logout_sidebar_link");
    const resetSidebarLink = $("#reset_sidebar_link");

    await buttonBurger.click();

    await expect(sidebar).toHaveAttribute("aria-hidden", "false");
    await expect(inventorySidebarLink).toBeDisplayed();
    await expect(aboutSidebarLink).toBeDisplayed();
    await expect(logoutSidebarLink).toBeDisplayed();
    await expect(resetSidebarLink).toBeDisplayed();

    await logoutSidebarLink.click();

    await expect(login.userName).toHaveValue(null);
    await expect(login.password).toHaveValue(null);
    await expect(browser).toHaveUrl("https://www.saucedemo.com/");
  });

  it("Saving the card after logout", async () => {
    await login.navigateTo();
    await login.enterData('standard_user', 'secret_sauce');
    const shoppingCartBadge = $('//span[@data-test = "shopping-cart-badge"]');
    const shoppingCartLink = $('//a[@class = "shopping_cart_link"]');
    const qty = $('//div[@class = "cart_quantity"]');
    const itemName = $('//div[@class = "inventory_item_name"]');
    const addToCard = $("#add-to-cart-sauce-labs-backpack");
    const buttonBurger = $("#react-burger-menu-btn");
    const sidebar = $(".bm-menu-wrap");
    const inventorySidebarLink = $("#inventory_sidebar_link");
    const aboutSidebarLink = $("#about_sidebar_link");
    const logoutSidebarLink = $("#logout_sidebar_link");
    const resetSidebarLink = $("#reset_sidebar_link");

    await addToCard.click();
    await expect(shoppingCartBadge).toHaveText("1");

    await buttonBurger.click();

    await expect(sidebar).toHaveAttribute("aria-hidden", "false");
    await expect(inventorySidebarLink).toBeDisplayed();
    await expect(aboutSidebarLink).toBeDisplayed();
    await expect(logoutSidebarLink).toBeDisplayed();
    await expect(resetSidebarLink).toBeDisplayed();

    await logoutSidebarLink.click();

    await expect(login.userName).toHaveValue(null);
    await expect(login.password).toHaveValue(null);
    await expect(browser).toHaveUrl("https://www.saucedemo.com/");

    await login.enterData('standard_user', 'secret_sauce');

    await expect(browser).toHaveUrl("https://www.saucedemo.com/inventory.html");
    const wareImage = $$('//img[@class = "inventory_item_img"]');
    for await (const img of wareImage) {
      await expect(img).toBeDisplayed();
    }

    await shoppingCartLink.click();
    await expect(browser).toHaveUrl("https://www.saucedemo.com/cart.html");
    await expect(qty).toHaveText("1");
    await expect(itemName).toHaveText("Sauce Labs Backpack");
    await $("#remove-sauce-labs-backpack").click();
  });

  it("Sorting", async () => {
    await login.navigateTo();
    await login.enterData('standard_user', 'secret_sauce');
    let sortContainer = $(".product_sort_container");

    //for sorting names by A to Z
    await sortContainer.selectByAttribute("value", "az");
    let inventory_item_name = await browser
      .$$('//div[@data-test = "inventory-item-name"]')
      .map((elem) => elem.getText());
    for (let i = 0; i < inventory_item_name.length - 1; i++) {
      expect(inventory_item_name[i].localeCompare(inventory_item_name[i + 1])).toBeLessThanOrEqual(0);
    }

    //for sorting names by Z to A
    await sortContainer.selectByAttribute("value", "za");
    inventory_item_name = await browser
      .$$('//div[@data-test = "inventory-item-name"]')
      .map((elem) => elem.getText());
    for (let i = 0; i < inventory_item_name.length - 1; i++) {
      expect(inventory_item_name[i].localeCompare(inventory_item_name[i + 1])).toBeGreaterThanOrEqual(0);
    }

    //for sorting prices by low to high
    await sortContainer.selectByAttribute("value", "lohi");
    let inventory_item_price = await browser
      .$$('//div[@data-test = "inventory-item-price"]')
      .map((elem) => elem.getText());
    let prices = [];
    for (let ascendNumber of inventory_item_price) {
      const numericPrice = parseFloat(ascendNumber.replace("$", ""));
      prices.push(numericPrice);
    }
    console.log(prices);
    for (let i = 0; i < prices.length - 1; i++) {
      expect(prices[i]).toBeLessThanOrEqual(prices[i + 1]);
    }

    //for sorting prices by high to low
    await sortContainer.selectByAttribute("value", "hilo");
    inventory_item_price = await browser
      .$$('//div[@data-test = "inventory-item-price"]')
      .map((elem) => elem.getText());
    prices = [];
    for (let descendNumber of inventory_item_price) {
      const numericPrice = parseFloat(descendNumber.replace("$", ""));
      prices.push(numericPrice);
    }
    for (let i = 0; i < prices.length - 1; i++) {
      expect(prices[i]).toBeGreaterThanOrEqual(prices[i + 1]);
    }
  });

  it("Footer Links", async () => {
    await login.navigateTo();
    await login.enterData('standard_user', 'secret_sauce');
    const mainWindowHandle = await browser.getWindowHandle();
    const twitterLink = $('//a[@data-test = "social-twitter"]');
    const facebookLink = $('//a[@data-test = "social-facebook"]');
    const linkedinLink = $('//a[@data-test = "social-linkedin"]');
    const buttonsArray = [twitterLink, facebookLink, linkedinLink];
    const linksArray = [
      "https://x.com/saucelabs",
      "https://www.facebook.com/saucelabs",
      "https://www.linkedin.com/company/sauce-labs/",
    ];

    let counter = 0;
    for await (const i of linksArray) {
      await buttonsArray[counter].click();
      const allWindowHandles = await browser.getWindowHandles();
      const newTabHandle = allWindowHandles.find(
        (handle) => handle !== mainWindowHandle
      );
      await browser.switchToWindow(newTabHandle);
      const currentUrl = await browser.getUrl();
      await expect(currentUrl).toContain(i);
      await browser.closeWindow();
      await browser.switchToWindow(mainWindowHandle);
      counter++;
    }
  });

  it("Valid Checkout", async () => {
    await login.navigateTo();
    await login.enterData('standard_user', 'secret_sauce');
    const shoppingCartLink = $('//a[@class = "shopping_cart_link"]');
    const itemName = $('//div[@class = "inventory_item_name"]');
    const itemPrice = $('//div[@data-test = "inventory-item-price"]');
    const addToCard = $("#add-to-cart-sauce-labs-backpack");
    const buttonCheckout = $("#checkout");
    const checkoutForm = $('//div[@class = "checkout_info"]');
    const inputFirstName = $("#first-name");
    const inputLastName = $("#last-name");
    const inputPostalCode = $("#postal-code");
    const buttonContinue = $("#continue");
    const buttonFinish = $("#finish");
    const thankUMessage = $('//h2[@data-test = "complete-header"]');
    const buttonBackHome = $("#back-to-products");

    await addToCard.click();
    const shoppingCartBadge = $('//span[@data-test = "shopping-cart-badge"]');
    await expect(shoppingCartBadge).toHaveText("1");

    await shoppingCartLink.click();
    await expect(browser).toHaveUrl("https://www.saucedemo.com/cart.html");
    const qty = $('//div[@class = "cart_quantity"]');
    await expect(qty).toHaveText("1");
    await expect(itemName).toHaveText("Sauce Labs Backpack");

    await buttonCheckout.click();
    await expect(checkoutForm).toBeDisplayed();

    await inputFirstName.setValue("firstname");
    await inputLastName.setValue("lastname");
    await inputPostalCode.setValue("12345");
    await expect(inputFirstName).toHaveValue("firstname");
    await expect(inputLastName).toHaveValue("lastname");
    await expect(inputPostalCode).toHaveValue("12345");

    await buttonContinue.click();
    await expect(browser).toHaveUrl(
      "https://www.saucedemo.com/checkout-step-two.html"
    );
    await expect(qty).toHaveText("1");
    await expect(itemName).toHaveText("Sauce Labs Backpack");
    await expect(itemPrice).toHaveText("$29.99");

    await buttonFinish.click();
    await expect(browser).toHaveUrl(
      "https://www.saucedemo.com/checkout-complete.html"
    );
    await expect(thankUMessage).toHaveText("Thank you for your order!");

    await buttonBackHome.click();
    await expect(browser).toHaveUrl("https://www.saucedemo.com/inventory.html");
    const wareImage = $$('//img[@class = "inventory_item_img"]');
    for await (const img of wareImage) {
      await expect(img).toBeDisplayed();
    }
    await expect(shoppingCartBadge).not.toExist();
  });

  it("Checkout without products", async () => {
    await login.navigateTo();
    await login.enterData('standard_user', 'secret_sauce');
    const shoppingCartLink = $('//a[@class = "shopping_cart_link"]');
    const inventory_item = $('//div[@data-test = "inventory-item"]');
    const buttonCheckout = $("#checkout");

    await shoppingCartLink.click();
    await expect(browser).toHaveUrl("https://www.saucedemo.com/cart.html");
    await expect(inventory_item).not.toExist();

    await buttonCheckout.click();
    await expect(browser).toHaveUrl(
      "https://www.saucedemo.com/checkout-step-one.html"
    );
    await expect($("#root")).toContain("Cart is empty");
  });
});
