import "chromedriver"
import { Builder, By, Key, ThenableWebDriver, until, WebElement } from "selenium-webdriver"
import * as assert from "assert"
describe("MWM tests", () => {
	let driver: ThenableWebDriver
	before("Before", async () => {
		driver = new Builder().forBrowser("chrome").build();
	})
	describe('App run through', async ()=> {
	it("Open MWM and check URL correct", async () => {
		const driver = await new Builder().forBrowser('chrome').build();
		await driver.get('http://2a246.yeg.rac.sh/');
	
		const currentUrl = await driver.getCurrentUrl();
		// make sure correct URL opened
		assert.strictEqual(
		  'http://2a246.yeg.rac.sh/',
		  currentUrl,
		  'Correct URL not opened',
		);
	})
	it("MWM sign up", async () => {
		const driver = await new Builder().forBrowser('chrome').build();
		await driver.get('http://2a246.yeg.rac.sh/');

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

		// wait to ensure that error message loaded as sometimes driver gets element before 
		//driver.manage().setTimeouts({implicit:1000});
		//driver.sleep(2000);
		
		// getting text from the password not matching error message
		let notMatchingPasswords = await driver.wait(until.elementLocated(
			By.xpath(
			"//p[@style = 'color: crimson; font-size: 14px; width: 25ch; margin-left: auto; margin-right: auto;']",
			),
		)
		).getText()
		
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

	})
	it('Logs into app, showing error handling when incorrect password or empty field present', async ()=>{

		const driver = await new Builder().forBrowser('chrome').build();
		await driver.get('http://2a246.yeg.rac.sh/');
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
				'MuiButton-label',
			),
		);
		await userNameElement.sendKeys('user');
		await loginButton.click();
		// quick wait to ensure element has been updated
		//driver.manage().setTimeouts({implicit:1000});
		//driver.sleep(2000);

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
		// quick wait to ensure element loaded with error message
		//driver.manage().setTimeouts({implicit:2000});


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

		// refreshing page as sometimes components don't load fast enough, this has been tested manually and correctly brings up next page
		// without this next line selenium would load fast enough ~ 60% of the time, and 40% would throw an error
		//TODO try to fix this
		await driver.get('http://2a246.yeg.rac.sh/dashboard');

		let currentUrl = await driver.getCurrentUrl();
		// making sure loads properly before retrieving

		// testing that logging in takes the user to the dashboard
		
		assert.strictEqual(
			'http://2a246.yeg.rac.sh/dashboard',
			currentUrl,
			'Should be on dashboard page after log in',
		);
		
	})
	it('Create a team and match', async ()=>{

		const driver = await new Builder().forBrowser('chrome').build();
		await driver.get('http://2a246.yeg.rac.sh/');
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
				'MuiButton-label',
			),
		);
		await userNameElement.sendKeys('Username');
		await passwordElement.sendKeys('password');
		// log in 
		await loginButton.click();

		// refreshing page as sometimes components don't load fast enough, this has been tested manually and correctly brings up next page
		// without this next line selenium would load fast enough ~ 60% of the time, and 40% would throw an error
		//TODO try to fix this
		driver.get('http://2a246.yeg.rac.sh/dashboard');

		// will now be on dashboard (this was tested in the previous test by checking URL)
		const teamsButton = await driver.findElement(
			By.xpath("//a[@href ='/teams']",
			),
		);
		await teamsButton.click();

		let currentURL = await driver.getCurrentUrl();

		// testing to see taken to teams page

		assert.strictEqual(currentURL,'http://2a246.yeg.rac.sh/teams', 'Teams page loaded correctly');

		const teamPageButtons = await driver.findElements(
			By.className('MuiButton-label')
		);

		// will be the second last button, as there will be edit roster buttons to edit each roster, then add team button, and lastly dashboard button
		const addTeamButton = teamPageButtons[teamPageButtons.length-2];
		await addTeamButton.click();
		
		currentURL = await driver.getCurrentUrl();
		// should be on create team page now
		assert.strictEqual(currentURL, 'http://2a246.yeg.rac.sh/create-team', 'Should now be on create team page');

		const textBoxesAddTeam = await driver.findElements(By.xpath("//input[@type ='text']"));
		// adding random team name 
		const randName = Math.floor(Math.random()*10000000);

		let createTeamButtons = await driver.findElements(By.className('MuiButton-label'));

		await textBoxesAddTeam[0].sendKeys(randName);
		// populating players
		await textBoxesAddTeam[1].sendKeys('Joey');
		await textBoxesAddTeam[2].sendKeys('Banks');
		await textBoxesAddTeam[3].sendKeys(1);

		await createTeamButtons[0].click();

		await textBoxesAddTeam[1].sendKeys('Zoey');
		await textBoxesAddTeam[2].sendKeys('Zoo');
		await textBoxesAddTeam[3].sendKeys(2);

		await createTeamButtons[0].click();

		await textBoxesAddTeam[1].sendKeys('Mr');
		await textBoxesAddTeam[2].sendKeys('Moo');
		await textBoxesAddTeam[3].sendKeys(3);

		await createTeamButtons[0].click();

		await textBoxesAddTeam[1].sendKeys('GoodOl');
		await textBoxesAddTeam[2].sendKeys('Lou');
		await textBoxesAddTeam[3].sendKeys(4);

		await createTeamButtons[0].click();

		await textBoxesAddTeam[1].sendKeys('Red');
		await textBoxesAddTeam[2].sendKeys('Hot');
		await textBoxesAddTeam[3].sendKeys(5);

		await createTeamButtons[0].click();

		await textBoxesAddTeam[1].sendKeys('Mr');
		await textBoxesAddTeam[2].sendKeys('Robot');
		await textBoxesAddTeam[3].sendKeys(6);

		await createTeamButtons[0].click();

		await textBoxesAddTeam[1].sendKeys('Slow');
		await textBoxesAddTeam[2].sendKeys('Poke');
		await textBoxesAddTeam[3].sendKeys(7);

		await createTeamButtons[0].click();

		await textBoxesAddTeam[1].sendKeys('No');
		await textBoxesAddTeam[2].sendKeys('Joke');
		await textBoxesAddTeam[3].sendKeys(8);

		// supposed to add team doesn't work
		await createTeamButtons[0].click();
		
		// need to add test checking if player added correctly
	})
})
	after("After", async () => {
		try{
			driver.quit();
		}
		catch(error){
			console.log('error is here on driver quit');
			console.log(error);
		}
	}) 
})
