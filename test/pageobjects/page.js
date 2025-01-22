export default class Page {
  constructor() {
    this.title = "My Page";
  }
  async open(path) {
    await browser.url(`https://www.saucedemo.com/${path}`);
  }
}
