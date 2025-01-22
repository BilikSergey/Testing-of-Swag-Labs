//@ts-check
import Page from "./page";

class InventoryPage extends Page {
  get wareImage() {
    return $$('//img[@class = "inventory_item_img"]');
  }
  get urlOfInventory() {
    return "https://www.saucedemo.com/inventory.html";
  }
  get buttonBurger() {
    return $("#react-burger-menu-btn");
  }
  get sidebar() {
    return $(".bm-menu-wrap");
  }
  get aboutSidebarLink() {
    return $("#about_sidebar_link");
  }
  get inventorySidebarLink() {
    return $("#inventory_sidebar_link");
  }
  get logoutSidebarLink() {
    return $("#logout_sidebar_link");
  }
  get shoppingCartBadge() {
    return $('//span[@data-test = "shopping-cart-badge"]');
  }
  get shoppingCartLink() {
    return $('//a[@class = "shopping_cart_link"]');
  }
  get addToCard() {
    return $("#add-to-cart-sauce-labs-backpack");
  }
  get resetSidebarLink() {
    return $("#reset_sidebar_link");
  }
  get removeBackpack() {
    return $("#remove-sauce-labs-backpack");
  }
  get sortContainer() {
    return $(".product_sort_container");
  }
  get buttonsArray() {
    return [
      $('//a[@data-test = "social-twitter"]'),
      $('//a[@data-test = "social-facebook"]'),
      $('//a[@data-test = "social-linkedin"]'),
    ];
  }
  get linksArray() {
    return [
      "https://x.com/saucelabs",
      "https://www.facebook.com/saucelabs",
      "https://www.linkedin.com/company/sauce-labs/",
    ];
  }

  async buttonsArrayClick(counter) {
    await this.buttonsArray[counter].click();
  }
  async inventoryItemPrice() {
    return await browser
      .$$('//div[@data-test = "inventory-item-price"]')
      .map((elem) => elem.getText());
  }
  async inventoryItemName() {
    return await browser
      .$$('//div[@data-test = "inventory-item-name"]')
      .map((elem) => elem.getText());
  }
  async sortContainerSelectAtribute(kindOfSort) {
    await this.sortContainer.selectByAttribute("value", kindOfSort);
  }
  async shoppingCartLinkClick() {
    await this.shoppingCartLink.click();
  }
  async removeBackpackClick() {
    await this.removeBackpack.click();
  }
  async addToCardClick() {
    await this.addToCard.click();
  }
  async logoutSidebarLinkClick() {
    await this.logoutSidebarLink.click();
  }
  async buttonBurgerClick() {
    await this.buttonBurger.click();
  }
}

export default new InventoryPage();
