//@ts-check
import LoginPage from "../pageobjects/login.page.js";
import InventoryPage from "../pageobjects/inventory.page.js";
import CartPage from "../pageobjects/cart.page.js";
import CheckoutPage from "../pageobjects/checkout.page.js";

describe("My Login application", () => {
  beforeEach(async () => {
    await LoginPage.open();
  });

  it("Valid Login", async () => {
    await LoginPage.enterData(
      LoginPage.allLogins[0],
      LoginPage.allPasswords[0]
    );

    await expect(browser).toHaveUrl(InventoryPage.urlOfInventory);
    for await (const img of InventoryPage.wareImage) {
      await expect(img).toBeDisplayed();
    }
  });

  it("Login with invalid password", async () => {
    await LoginPage.enterData(LoginPage.allLogins[0], "invalid_password");

    for await (const img of LoginPage.cruciate) {
      await expect(img).toBeDisplayed();
    }
    await expect(LoginPage.inputUserName).toHaveAttribute(
      LoginPage.highlightedWithRed[0],
      LoginPage.highlightedWithRed[1]
    );
    await expect(LoginPage.inputPassword).toHaveAttribute(
      LoginPage.highlightedWithRed[0],
      LoginPage.highlightedWithRed[1]
    );
    await expect(LoginPage.errorH3).toHaveText(LoginPage.notLogined);
  });

  it("Login with invalid login", async () => {
    await LoginPage.enterData("invalid_login", LoginPage.allPasswords[0]);

    for await (const img of LoginPage.cruciate) {
      await expect(img).toBeDisplayed();
    }
    await expect(LoginPage.inputUserName).toHaveAttribute(
      LoginPage.highlightedWithRed[0],
      LoginPage.highlightedWithRed[1]
    );
    await expect(LoginPage.inputPassword).toHaveAttribute(
      LoginPage.highlightedWithRed[0],
      LoginPage.highlightedWithRed[1]
    );
    await expect(LoginPage.errorH3).toHaveText(LoginPage.notLogined);
  });

  it("Logout", async () => {
    await LoginPage.enterData(
      LoginPage.allLogins[0],
      LoginPage.allPasswords[0]
    );
    await InventoryPage.buttonBurgerClick();
    await expect(InventoryPage.sidebar).toHaveAttribute("aria-hidden", "false");
    await expect(InventoryPage.inventorySidebarLink).toBeDisplayed();
    await expect(InventoryPage.aboutSidebarLink).toBeDisplayed();
    await expect(InventoryPage.logoutSidebarLink).toBeDisplayed();
    await expect(InventoryPage.resetSidebarLink).toBeDisplayed();

    await InventoryPage.logoutSidebarLinkClick();

    await expect(LoginPage.inputUserName).toHaveValue(null);
    await expect(LoginPage.inputPassword).toHaveValue(null);
    await expect(browser).toHaveUrl(LoginPage.urlOfMainPage);
  });

  it("Saving the card after logout", async () => {
    await LoginPage.enterData(
      LoginPage.allLogins[0],
      LoginPage.allPasswords[0]
    );
    const allItemsNames = await InventoryPage.inventoryItemName();
    await InventoryPage.addToCardClick();
    await expect(InventoryPage.shoppingCartBadge).toHaveText("1");

    await InventoryPage.buttonBurgerClick();

    await expect(InventoryPage.sidebar).toHaveAttribute("aria-hidden", "false");
    await expect(InventoryPage.inventorySidebarLink).toBeDisplayed();
    await expect(InventoryPage.aboutSidebarLink).toBeDisplayed();
    await expect(InventoryPage.logoutSidebarLink).toBeDisplayed();
    await expect(InventoryPage.resetSidebarLink).toBeDisplayed();

    await InventoryPage.logoutSidebarLinkClick();

    await expect(LoginPage.inputUserName).toHaveValue(null);
    await expect(LoginPage.inputPassword).toHaveValue(null);
    await expect(browser).toHaveUrl(LoginPage.urlOfMainPage);

    await LoginPage.enterData(
      LoginPage.allLogins[0],
      LoginPage.allPasswords[0]
    );

    await expect(browser).toHaveUrl(InventoryPage.urlOfInventory);
    for await (const img of InventoryPage.wareImage) {
      await expect(img).toBeDisplayed();
    }

    await InventoryPage.shoppingCartLinkClick();
    await expect(browser).toHaveUrl(CartPage.urlOfCart);
    await expect(CartPage.qty).toHaveText("1");
    await expect(CartPage.itemName).toHaveText(allItemsNames[0]);
    await InventoryPage.removeBackpackClick();
  });

  it("Sorting", async () => {
    await LoginPage.enterData(
      LoginPage.allLogins[0],
      LoginPage.allPasswords[0]
    );
    //for sorting names by A to Z
    await InventoryPage.sortContainerSelectAtribute("az");
    let inventoryItemName = await InventoryPage.inventoryItemName();
    for (let i = 0; i < inventoryItemName.length - 1; i++) {
      expect(
        inventoryItemName[i].localeCompare(inventoryItemName[i + 1])
      ).toBeLessThanOrEqual(0);
    }

    //for sorting names by Z to A
    await InventoryPage.sortContainerSelectAtribute("za");
    inventoryItemName = await InventoryPage.inventoryItemName();
    for (let i = 0; i < inventoryItemName.length - 1; i++) {
      expect(
        inventoryItemName[i].localeCompare(inventoryItemName[i + 1])
      ).toBeGreaterThanOrEqual(0);
    }

    //for sorting prices by low to high
    await InventoryPage.sortContainerSelectAtribute("lohi");
    let inventoryItemPrice = await InventoryPage.inventoryItemPrice();
    let prices = [];
    for (let ascendNumber of inventoryItemPrice) {
      const numericPrice = parseFloat(ascendNumber.replace("$", ""));
      prices.push(numericPrice);
    }
    console.log(prices);
    for (let i = 0; i < prices.length - 1; i++) {
      expect(prices[i]).toBeLessThanOrEqual(prices[i + 1]);
    }

    //for sorting prices by high to low
    await InventoryPage.sortContainerSelectAtribute("hilo");
    inventoryItemPrice = await InventoryPage.inventoryItemPrice();
    prices = [];
    for (let descendNumber of inventoryItemPrice) {
      const numericPrice = parseFloat(descendNumber.replace("$", ""));
      prices.push(numericPrice);
    }
    for (let i = 0; i < prices.length - 1; i++) {
      expect(prices[i]).toBeGreaterThanOrEqual(prices[i + 1]);
    }
  });

  it("Footer Links", async () => {
    await LoginPage.enterData(
      LoginPage.allLogins[0],
      LoginPage.allPasswords[0]
    );
    const mainWindowHandle = await browser.getWindowHandle();

    let counter = 0;
    for await (const i of InventoryPage.linksArray) {
      await InventoryPage.buttonsArrayClick(counter);
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
    await LoginPage.enterData(
      LoginPage.allLogins[0],
      LoginPage.allPasswords[0]
    );
    const allItemPrices = await InventoryPage.inventoryItemPrice();
    const allItemsNames = await InventoryPage.inventoryItemName();
    await InventoryPage.addToCardClick();
    await expect(InventoryPage.shoppingCartBadge).toHaveText("1");

    await InventoryPage.shoppingCartLinkClick();
    await expect(browser).toHaveUrl(CartPage.urlOfCart);
    await expect(CartPage.qty).toHaveText("1");
    await expect(CartPage.itemName).toHaveText(allItemsNames[0]);

    await CartPage.buttonCheckoutClick();
    await expect(CheckoutPage.checkoutForm).toBeDisplayed();

    await CheckoutPage.inputInfoSetValue("firstname", "lastname", "12345");
    await expect(CheckoutPage.inputFirstName).toHaveValue("firstname");
    await expect(CheckoutPage.inputLastName).toHaveValue("lastname");
    await expect(CheckoutPage.inputPostalCode).toHaveValue("12345");

    await CheckoutPage.buttonContinueClick();
    await expect(browser).toHaveUrl(CheckoutPage.urlOfCheckoutStepTwo);
    await expect(CartPage.qty).toHaveText("1");
    await expect(CartPage.itemName).toHaveText(allItemsNames[0]);
    await expect(CartPage.itemPrice).toHaveText(allItemPrices[0]);

    await CheckoutPage.buttonFinishClick();
    await expect(browser).toHaveUrl(CheckoutPage.urlOfCheckoutComplete);
    await expect(CheckoutPage.thankUMessage).toHaveText(
      "Thank you for your order!"
    );

    await CheckoutPage.buttonBackHomeClick();
    await expect(browser).toHaveUrl(InventoryPage.urlOfInventory);
    for await (const img of InventoryPage.wareImage) {
      await expect(img).toBeDisplayed();
    }
    await expect(InventoryPage.shoppingCartBadge).not.toExist();
  });

  it("Checkout without products", async () => {
    await LoginPage.enterData(
      LoginPage.allLogins[0],
      LoginPage.allPasswords[0]
    );

    await InventoryPage.shoppingCartLinkClick();
    await expect(browser).toHaveUrl(CartPage.urlOfCart);
    await expect(CartPage.inventoryItem).not.toExist();

    await CheckoutPage.buttonCheckoutClick();
    await expect(browser).toHaveUrl(CheckoutPage.urlOfCheckoutStepOne);
    await expect(CheckoutPage.entirePage).toHaveText(
      expect.stringContaining("Cart is empty")
    );
  });
});
