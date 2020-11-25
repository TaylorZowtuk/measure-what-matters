import 'chromedriver';
import { Builder, ThenableWebDriver, By, Key, until } from 'selenium-webdriver';
import * as assert from 'assert';

describe('Run MWM App', () => {
  it('Run MWM App', async () => {
    /**
     *
     *
     * First portion of testing tests sign up error handling then signs up a user
     *
     *
     */

    // increase timeout time to 60 seconds as test is longer than 5 seconds
    //jest.setTimeout(60000);
    const driver = await new Builder().forBrowser('chrome').build();
    await driver.get('localhost:3000/');

    const currentUrl = await driver.getCurrentUrl();

    // make sure correct URL opened
    assert.strictEqual(
      'http://localhost:3000/',
      currentUrl,
      'Correct URL not opened',
    );

    // opening signup page
    await driver.findElement(By.xpath("//a[@href ='/signup']")).click();

    // getting first name, last name, username elements
    let nameElements = await driver.findElements(
      By.id('outlined-margin-dense'),
    );
    // sending keys to these elements
    await nameElements[0].sendKeys('firstName');
    await nameElements[1].sendKeys('lastName');
    await nameElements[2].sendKeys('Username');

    // getting password and confirm password elements
    let passwordElements = await driver.findElements(
      By.id('outlined-adornment-password'),
    );
    // sending keys to passwords that do not match
    await passwordElements[0].sendKeys('password');
    await passwordElements[1].sendKeys('password2');
    // click signup button
    await driver.findElement(By.className('MuiButton-label')).click();
    // getting text from the password not matching error message
    const notMatchingPasswords = await driver
      .findElement(
        By.xpath(
          "//p[@style = 'color: crimson; font-size: 14px; width: 25ch; margin-left: auto; margin-right: auto;']",
        ),
      )
      .getText();

    // testing that passwords not matching brings up a message to the user saying passwords don't match
    assert.strictEqual(
      notMatchingPasswords,
      'Passwords must match!',
      'Password not match error did not come up',
    );
    // clearing password elements to put a correct password in
    await passwordElements[0].sendKeys(Key.CONTROL + 'a');
    await passwordElements[0].sendKeys(Key.DELETE);
    await passwordElements[1].sendKeys(Key.CONTROL + 'a');
    await passwordElements[1].sendKeys(Key.DELETE);
    // putting in correct passwords
    await passwordElements[0].sendKeys('password');
    await passwordElements[1].sendKeys('password');
    // clicking signup button with correct parameters in it
    await driver.findElement(By.className('MuiButton-label')).click();
    driver.close();
    driver.quit();
  });

  it('After sign up tests', async () => {
    /**
     *
     *
     * Second portion of testing tests sign in error handling then logs in
     *
     *
     */
    // increase timeout time to 60 seconds as test is longer than 5 seconds
    //jest.setTimeout(60000);
    const driver = await new Builder().forBrowser('chrome').build();
    await driver.get('localhost:3000/');

    const currentUrl = await driver.getCurrentUrl();

    // make sure correct URL opened
    assert.strictEqual(
      'http://localhost:3000/',
      currentUrl,
      'Correct URL not opened',
    );
    // setting element for where username entered
    const userNameElement = await driver.findElement(
      By.id('outlined-margin-dense'),
    );
    // setting element for where password entered
    const passwordElement = await driver.findElement(
      By.id('outlined-adornment-password'),
    );
    // setting element for login button
    const loginButton = await driver.findElement(
      By.className(
        'MuiButtonBase-root MuiButton-root MuiButton-contained makeStyles-button-4',
      ),
    );
    await userNameElement.sendKeys('user');
    await loginButton.click();
    let errorElement = await driver.findElement(
      By.xpath(
        "//p[@style ='color: crimson; font-size: 14px; width: 30ch; margin-left: auto; margin-right: auto;']",
      ),
    );
    let errorMessage = await errorElement.getText();
    assert.strictEqual(
      errorMessage,
      'Please enter username and password.',
      'Empty username or password test failed',
    );
    await passwordElement.sendKeys('pass');
    await loginButton.click();

    errorElement = driver.wait(
      until.elementLocated(
        By.xpath(
          "//p[@style ='color: crimson; font-size: 14px; width: 30ch; margin-left: auto; margin-right: auto;']",
        ),
      ),
    );
    errorMessage = await errorElement.getText();
    assert.strictEqual(
      errorMessage,
      'Wrong username or password.',
      'Incorrect username or password test failed',
    );

    // clearing username and password elements to put in correct username and password made in signup section
    await userNameElement.sendKeys(Key.CONTROL + 'a');
    await userNameElement.sendKeys(Key.DELETE);
    await passwordElement.sendKeys(Key.CONTROL + 'a');
    await passwordElement.sendKeys(Key.DELETE);

    await userNameElement.sendKeys('Username');
    await passwordElement.sendKeys('password');
    await loginButton.click();

    driver.close();
    driver.quit();
  });
});
