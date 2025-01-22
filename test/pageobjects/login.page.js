//@ts-check
import Page from "./page";

class LoginPage extends Page {
  get inputUserName() {
    return $("#user-name");
  }
  get inputPassword() {
    return $("#password");
  }
  get cruciate() {
    return $$('div.form_group svg[data-icon="times-circle"]');
  }
  get errorH3() {
    return $('h3[data-test="error"]');
  }
  get urlOfMainPage() {
    return "https://www.saucedemo.com/";
  }
  get notLogined() {
    return "Epic sadface: Username and password do not match any user in this service";
  }
  get highlightedWithRed() {
    return ["class", "input_error form_input error"];
  }
  get allLogins() {
    return [
      "standard_user",
      "locked_out_user",
      "problem_user",
      "performance_glitch_user",
      "secret_sauce",
      "error_user",
      "visual_user",
    ];
  }
  get allPasswords() {
    return ["secret_sauce"];
  }

  async enterData(name, pass) {
    await this.inputUserName.setValue(name);
    await this.inputPassword.setValue(pass);
    await expect(this.inputUserName).toHaveValue(name);
    await expect(this.inputPassword).toHaveValue(pass);
    await expect(this.inputPassword).toHaveAttribute("type", "password");
    await $("#login-button").click();
  }
  async open() {
    await super.open("");
  }
}

export default new LoginPage();
