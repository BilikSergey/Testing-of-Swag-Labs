//@ts-check
import Page from "./page";

class CartPage extends Page {
  get qty() {
    return $('//div[@class = "cart_quantity"]');
  }
  get itemName() {
    return $('//div[@class = "inventory_item_name"]');
  }
  get itemPrice() {
    return $('//div[@data-test = "inventory-item-price"]');
  }
  get buttonCheckout() {
    return $("#checkout");
  }
  get urlOfCart() {
    return "https://www.saucedemo.com/cart.html";
  }
  get inventoryItem() {
    return $('//div[@data-test = "inventory-item"]');
  }

  async buttonCheckoutClick() {
    await this.buttonCheckout.click();
  }
}

export default new CartPage();
