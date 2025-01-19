import { $ } from '@wdio/globals';

export class Login {
    constructor() {
        this.userName = $("#user-name");
        this.password = $("#password");
    }

    async navigateTo() {
        await browser.url('https://www.saucedemo.com/');
    }

    async enterData(name, pass) {
        await this.userName.setValue(name);
        await this.password.setValue(pass);
        await expect(this.userName).toHaveValue(name);
        await expect(this.password).toHaveValue(pass);
        await expect(this.password).toHaveAttribute("type", "password");
        await $("#login-button").click();
    }
}
