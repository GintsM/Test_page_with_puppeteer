var puppeteer = require('puppeteer');

class Browser {
  Browser(options) {
    this.browser = puppeteer.launch({ headless: options })
  }

  close() {
    this.browser.close();
  }


}