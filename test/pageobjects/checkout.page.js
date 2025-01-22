//@ts-check
import Page from "./page";

class CheckoutPage extends Page {
  get checkoutForm() {
    return $('//div[@class = "checkout_info"]');
  }
  get inputFirstName() {
    return $("#first-name");
  }
  get inputLastName() {
    return $("#last-name");
  }
  get inputPostalCode() {
    return $("#postal-code");
  }
  get buttonContinue() {
    return $("#continue");
  }
  get buttonCheckout() {
    return $("#checkout");
  }
  get buttonFinish() {
    return $("#finish");
  }
  get thankUMessage() {
    return $('//h2[@data-test = "complete-header"]');
  }
  get buttonBackHome() {
    return $("#back-to-products");
  }
  get urlOfCheckoutComplete() {
    return "https://www.saucedemo.com/checkout-complete.html";
  }
  get urlOfCheckoutStepTwo() {
    return "https://www.saucedemo.com/checkout-step-two.html";
  }
  get urlOfCheckoutStepOne() {
    return "https://www.saucedemo.com/checkout-step-one.html";
  }
  get entirePage() {
    return $("#root");
  }

  async inputInfoSetValue(firstName, lastName, postalCode) {
    await this.inputFirstName.setValue(firstName);
    await this.inputLastName.setValue(lastName);
    await this.inputPostalCode.setValue(postalCode);
  }
  async buttonBackHomeClick() {
    await this.buttonBackHome.click();
  }
  async buttonFinishClick() {
    await this.buttonFinish.click();
  }
  async buttonContinueClick() {
    await this.buttonContinue.click();
  }
  async buttonCheckoutClick() {
    await this.buttonCheckout.click();
  }
}

export default new CheckoutPage();
