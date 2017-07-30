import { expect } from 'chai';
import { binding, given, when, then } from 'cucumber-tsflow';
import { CallbackStepDefinition } from 'cucumber';

import { AppPageObject } from './app.page';

@binding()
export class AppSteps {
  private appPageObject = new AppPageObject();
  @given(/^I enter to the app url$/)
  async enterToAppUrl() {
    await this.appPageObject.navigateTo();
  };
  @then(/^I should see '(.*)' message$/)
  async shouldDisplayMessage(message: string) {
    const currentMessage = await this.appPageObject.getHeaderText();
    expect(message).equal(currentMessage);
  };
}
