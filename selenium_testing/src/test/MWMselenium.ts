import "chromedriver"
import { Builder, By, Key, ThenableWebDriver, until } from "selenium-webdriver"
import * as assert from "assert"
describe("MWM tests", () => {
	let driver: ThenableWebDriver
	// enter a new random username and password to run test
	const username = 'selenium1';
	const password = 'password1';
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
		await (await driver.findElement(By.xpath("//a[@href ='/signup']"))).click();

		// getting first name, last name, username elements
		let nameElements = await driver.findElements(
		By.id('outlined-margin-dense'),
		);
		// sending keys to these elements
		await nameElements[0].sendKeys('firstName');
		await nameElements[1].sendKeys('lastName');
		await nameElements[2].sendKeys(username);

		// getting password and confirm password elements
		let passwordElements = await driver.findElements(
		By.id('outlined-adornment-password'),
		);
		// sending keys to passwords that do not match
		await passwordElements[0].sendKeys('password');
		await passwordElements[1].sendKeys('password2');
		// click signup button
		await (await driver.findElement(By.className('MuiButton-label'))).click();

		
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
		await passwordElements[0].sendKeys(password);
		await passwordElements[1].sendKeys(password);
		// clicking signup button with correct parameters in it
		await (await driver.findElement(By.className('MuiButton-label'))).click();

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


		errorElement = await driver.wait(
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
	  
		await userNameElement.sendKeys(username);
		await passwordElement.sendKeys(password);
		await loginButton.click();

		// make sure elements in dashboard located before continuing

		await driver.wait(until.elementLocated(By.xpath("//a[@href ='/teams']")));

		let currentUrl = await driver.getCurrentUrl();

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
		await userNameElement.sendKeys(username);
		await passwordElement.sendKeys(password);
		// log in 
		await loginButton.click();

		// wait until expected component available as sometimes loads slowly here
		await driver.wait(until.elementLocated(By.xpath("//a[@href ='/teams']")));
		// find button to go to teams page and click it
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
		const randName = Math.floor(Math.random()*100000000);

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

		await createTeamButtons[0].click();
		// create the team
		await createTeamButtons[1].click();
		// back to dashboard , just used get to simplify, but createTeamButton[2] would return to teams page then dashboard accessible using dashboard button
		await driver.get('http://2a246.yeg.rac.sh/dashboard');

		// make a match with our new team

		await driver.wait(until.elementLocated(By.xpath("//a[@href ='/create-match']")), 10000).click();
		// will be at create a match page
		// wait until we are on right page before checking correct url, this page contains unique buttons that were not on previous page
		const clickablesWithSecondMenu = await driver.wait(until.elementsLocated(By.className("MuiSelect-root MuiSelect-select MuiSelect-selectMenu MuiInputBase-input MuiInput-input")));

		clickablesWithSecondMenu[0].click();

		currentURL = await driver.getCurrentUrl();
		
		assert.strictEqual(currentURL,'http://2a246.yeg.rac.sh/create-match','Correctly goes to create match page');
		// 
		const teamsAvailable = await driver.wait(until.elementsLocated(By.className("MuiButtonBase-root MuiListItem-root MuiMenuItem-root MuiMenuItem-gutters MuiListItem-gutters MuiListItem-button")));
		await teamsAvailable[1].click();
		// give opponent team name
		await driver.findElement(By.id("standard-basic")).sendKeys('The Tigers');
		// create the team
		await (await driver.findElement(By.className("MuiButton-label"))).click();
		// we are now returned to the dashboard,where we will start the next test from 

	})

	it('Records a created match, and pulls up tables after, then logs out', async ()=>{
		const driver = await new Builder().forBrowser('chrome').build();
		await driver.get('http://2a246.yeg.rac.sh/');
		// logging in 
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
		await userNameElement.sendKeys(username);
		await passwordElement.sendKeys(password);
		// log in 
		await loginButton.click();
		// wait until element on dashboard available then click it
		await (await driver.wait(until.elementLocated(By.xpath("//a[@href ='/matches/upcoming']")))).click();
		// get first match element to be recorded
		const matchToRecord = await driver.wait(until.elementLocated(By.className("MuiListItem-root MuiListItem-gutters MuiListItem-alignItemsFlexStart")));

		//should be on 'matches/upcoming' page

		const currentURL = await driver.getCurrentUrl();
		assert.strictEqual('http://2a246.yeg.rac.sh/matches/upcoming',currentURL,"Clicking recordings on dashboard brings the user ");

		// click on first match to be recorded, will be available from last test
		await matchToRecord.click();
		// will now be in lineup screen, we will select every player to play, so have to locate each checkbox
		const checkBoxesForLineup = await driver.wait(until.elementsLocated(By.className('jss14')),5000);
		// now that the /match/lineup url is guaranteed to be loaded (checkboxes from line above found), lets make sure its url is correct as well
		const currentURL2 = await driver.getCurrentUrl();
		assert.strictEqual('http://2a246.yeg.rac.sh/match/lineup',currentURL2,"Clicking on match to record brings user to lineups page");
		// continuing with checkboxes, we will check all boxes to put all the players in the lineup
		for(let i=0;i<checkBoxesForLineup.length;i++){
			await checkBoxesForLineup[i].click();
		}
		// load both buttons, we will use the "NEXT" one, but both have same identifiers, nexxt one will be 1 index in buttons
		const matchLineupButtons = await driver.findElements(By.className('MuiButtonBase-root MuiButton-root MuiButton-contained'));
		// click next button
		await matchLineupButtons[1].click();

	
		
		// wait for start button to load and click it to start timer 
		await (await driver.wait(until.elementLocated(By.className('btn btn-success')))).click()

		// assert we are on loading screen now that elements loaded

		const currentURL3 = await driver.getCurrentUrl();
		assert.strictEqual(currentURL3,'http://2a246.yeg.rac.sh/match/recording','Check we are on recording page after setting lineup');

		// make sure timer time is greater than 0
		const timer = await driver.findElement(By.className('Timer-display'));
		const timerTime = await timer.getText();

		assert.notStrictEqual(timerTime,'00 : 00 : 00 : 00', 'Ensure timer has started');

		// pause button should now be present, click it and end the half
		await (await driver.wait(until.elementLocated(By.className('btn btn-danger')),3000)).click();

		// now click end half
		await (await driver.wait(until.elementLocated(By.className('btn btn-warning')),3000)).click();

		// start second half and end it, buttons have been changing need to locate again
		// clicks start to start second half
		await (await driver.wait(until.elementLocated(By.className('btn btn-success')),5000)).click();

		//find period display and assert it is now the second half

		const periodDisplay = await driver.findElement(By.className('Period-display'));
		const periodDisplayText = await periodDisplay.getText();
		assert.strictEqual(periodDisplayText,'2nd Half',"Should now display second half after ending half");
		
		// click pause
		await (await driver.wait(until.elementLocated(By.className('btn btn-danger')),5000)).click();
		// click end game
		await (await driver.wait(until.elementLocated(By.className('btn btn-danger')),5000)).click();

		// we will now be on the dashboard page, lets open the stats for the game played and ensure reports are present
		// click stats by match icon
		await (await driver.wait(until.elementLocated(By.id('dropdown-basic')))).click();
		// select first match
		await (await driver.wait(until.elementLocated(By.className('dropdown-item')))).click();

		const possessionTimeTable = await driver.wait(until.elementLocated(By.tagName('h4')));
		const possessionTimeTableText = await possessionTimeTable.getText();
		// make sure possession time table first one present
		assert.strictEqual(possessionTimeTableText,'Possession Time','Possession time table is present');
		const tablesWithIds = await driver.findElements(By.id('tableTitle'));
		const numberOfTouches = await tablesWithIds[0].getText();
		const timeOnField = await tablesWithIds[1].getText();
		const plusMinus = await tablesWithIds[2].getText();

		// assert table headers equal what they should
		//number of touches
		assert.strictEqual(numberOfTouches,'Number of Touches', 'Correct header for Number of Touches Table');

		// time on field
		assert.strictEqual(timeOnField,'Time on Field', 'Correct header for Time on Field Table');

		// plus minus
		assert.strictEqual(plusMinus,'Plus Minus','Correct header for Plus Minus Table');

		//log out of app by clicking log out button
		await (await driver.findElement(By.className("btn btn-outline-danger"))).click();

		//should be brought back to main page
		// check if signup element available to ensure page is back to root
		await driver.findElement(By.xpath("//a[@href ='/signup']"));

		//make sure url back to root

		const currentURL4 = await driver.getCurrentUrl();

		assert.strictEqual(currentURL4,'http://2a246.yeg.rac.sh/');


	});
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
