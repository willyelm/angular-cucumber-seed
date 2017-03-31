import { NgtestPage } from './app.po';

describe('ngtest App', () => {
  let page: NgtestPage;
  beforeEach(() => {
    page = new NgtestPage();
  });
  it('should display message saying app works', async () => {
    await page.navigateTo();
    let text = await page.getParagraphText()
    expect(text).toEqual('app works!');
  });
});
