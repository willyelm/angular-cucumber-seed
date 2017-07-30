import { browser, element, by, protractor, ElementArrayFinder } from 'protractor';
import { promise as wdpromise } from 'selenium-webdriver';

export class AppPageObject {
  navigateTo() {
    return browser.get('/');
  }
  getHeaderText() {
    return element(by.css('app-root h1')).getText();
  }
}
