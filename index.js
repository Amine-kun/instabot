const {Builder, By, Key, until} = require('selenium-webdriver');
const readXlsx = require('xlsx');
const path = require('path');

// const username =  'anwar_____00000';
// const password =  '123.0123.0a';

	// const auto_code_detect = aria-label="Dismiss"
const message = 'Hello there.';

let USER_MESSAGE_COUNT = 0;
let CURRENT_USER_INDEX = 0;

const INSTA_MESSAGE_BTN = 'x1i10hfl xjqpnuy xa49m3k xqeqjp1 x2hbi6w x972fbf xcfux6l x1qhh985 xm0m39n xdl72j9 x2lah0s xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r x2lwn1j xeuugli xexx8yu x18d9i69 x1hl2dhg xggy1nq x1ja2u2z x1t137rt x1q0g3np x1lku1pv x1a2a7pz x6s0dn4 xjyslct x1lq5wgf xgqcy7u x30kzoy x9jhf4c x1ejq31n xd10rxx x1sy0etr x17r0tee x9f619 x1ypdohk x78zum5 x1f6kntn xwhw2v2 x10w6t97 xl56j7k x17ydfre x1swvt13 x1pi30zi x1n2onr6 x2b8uid xlyipyv x87ps6o x14atkfc xcdnw81 x1i0vuye x1gjpkn9 x5n08af xsz8vos';
const INTA_MESSAGE_SEND = 'x1i10hfl xjqpnuy xa49m3k xqeqjp1 x2hbi6w xdl72j9 x2lah0s xe8uvvx xdj266r xat24cr x1mh8g0r x2lwn1j xeuugli x1hl2dhg xggy1nq x1ja2u2z x1t137rt x1q0g3np x1lku1pv x1a2a7pz x6s0dn4 xjyslct x1ejq31n xd10rxx x1sy0etr x17r0tee x9f619 x1ypdohk x1f6kntn xwhw2v2 xl56j7k x17ydfre x2b8uid xlyipyv x87ps6o x14atkfc xcdnw81 x1i0vuye xjbqb8w xm3z3ea x1x8b98j x131883w x16mih1h x972fbf xcfux6l x1qhh985 xm0m39n xt0psk2 xt7dq6l xexx8yu x4uap5 x18d9i69 xkhd6sd x1n2onr6 x1n5bzlp x173jzuc x1yc6y37 xfs2ol5'
const INSTA_FOLLOW_BTN = '_acan _acap _acas _aj1- _ap30';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const readFile = async (path) =>{
	let workbook =await  readXlsx.readFile(`${__dirname}${path}`);
	let sheet_name = workbook.SheetNames;
	let toJson = workbook.Sheets[sheet_name[0]];
	let data = readXlsx.utils.sheet_to_json(toJson);

	return data;
}

const handle_login = async (driver, username, password) =>{

	try {
	    await driver.get('https://www.instagram.com/');

	    await sleep(5000);

			await driver.wait(until.elementLocated(By.name('username')), 10000); 
	    await driver.findElement(By.name('username')).sendKeys(username);
	    await driver.findElement(By.name('password')).sendKeys(password);

	    await sleep(5000);

	    await driver.findElement(By.className('_acan _acap _acas _aj1-')).click();

	    console.log('==========================================')
	    console.log(`logged into your acc : ${username}`);
	    console.log('==========================================')

	    await sleep(5000);
	  }	
	  catch(e){
	  	console.log('=====> ERROR: cannot loggin to this user.');
	  }

	  return 0
	}

const check_for_captcha = async (driver) =>{

}


const remove_notification_popup = async (driver) =>{
		try{
			await sleep(5000);

			await driver.wait(until.elementLocated(By.className('_a9-- _ap36 _a9_1')), 10000);;

			await driver.findElement(By.className('_a9-- _ap36 _a9_1')).click();
			console.log('popup removed');

			return 0
		} catch(e){
			return 0
		}
}

const handle_follow = async (driver) =>{
		try{
			await sleep(5000);

			await driver.wait(until.elementLocated(By.className(INSTA_FOLLOW_BTN)), 10000);;

			await driver.findElement(By.className(INSTA_FOLLOW_BTN)).click();
			console.log('user has been followed');

			return 0
		} catch(e){
			console.log('=====> ERROR : cannot follow user')
			return 0
		}
}

const sending_message = async (driver) =>{
		try{

			await sleep(5000);

			await driver.wait(until.elementLocated(By.css('[aria-label="Message"]')), 10000);;
			await driver.findElement(By.css('[aria-label="Message"]')).sendKeys(message);

			await sleep(5000);
			
			await driver.findElement(By.className(INTA_MESSAGE_SEND)).click();

			console.log('message sent to : ' + `${USER_MESSAGE_COUNT+1}`);
			USER_MESSAGE_COUNT++;

			await sleep(5000);

			return 0
		} catch(e){
			console.log(`=====> ERROR: cannot send a message`);
			return 0
		}
}

const handle_user_to_message= async(driver)=>{

	console.log('=> Reading users to message');
	const users = await readFile('/data/users_to_message.xlsx');

	while(USER_MESSAGE_COUNT < 5){
		try{
			await driver.get(`https://www.instagram.com/${users[CURRENT_USER_INDEX].users}/`);
			CURRENT_USER_INDEX++;

			await sleep(5000);

			console.log('=> following the user...');
			await handle_follow(driver);

			//if message btn is 0, pass with no increment and continue in the list
			await driver.wait(until.elementLocated(By.className(INSTA_MESSAGE_BTN)), 10000);;

			await driver.findElement(By.className(INSTA_MESSAGE_BTN)).click();
			console.log('=> etting DM');

			console.log('=> checking for popup')
			await remove_notification_popup(driver);

			console.log('=> sending message...')
			await sending_message(driver);

		} catch(e){
			console.log(`=====> ERROR: cannot get to DM`);
		}
	}

	console.log('=====> logging off ....')
	USER_MESSAGE_COUNT = 0;
	await driver.quit();
	return 0;
}

const main = async() =>{

	console.log('==========================================')
	console.log('=> Reading accounts');
	const logins = await readFile('/data/users.xlsx');

	for(let i=0 ; i < logins.length ; i++){

		const driver = await new Builder().forBrowser('chrome').build();
		await handle_login(driver, logins[i].username, logins[i].password);
		await handle_user_to_message(driver);

	}

	return 0
}
main();
