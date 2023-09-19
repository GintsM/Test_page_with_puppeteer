// import puppeteer from 'puppeteer';
var puppeteer = require('puppeteer');
require('dotenv').config();


(async () => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({ headless: 'new' })
  const page = await browser.newPage();
  const test_cases = []
  /*
  Test number 1
  * Visit main page accept cookies
  */

  // Navigate the page to a URL
  await page.goto('http://localhost:9515');

  // Set screen size
  await page.setViewport({ width: 900, height: 900 });

  try {
    // accept page cokkies
    const accept_cookies = '#accept_cookies';
    await page.click(accept_cookies)

  } catch (error) {
    console.log('Same error, From accept cookies')
  }

  var cookies = await page.cookies();
  try {
    // make more generic
    test_cases.push({ name: 'Test1', passed: cookies[0].name === 'Accept_c', description: ' from try, search in call name' })
  } catch (err) {
    test_cases.push({ name: 'Test1', passed: false, description: ' from catch, unhanled error' })
  }

  /*
  Test number 2
  * Visit privacy policy
  */

  // find a privacy policy link and click on it
  try {
    const privacyLink = 'footer>div.privacy>a';
    await page.click(privacyLink);
    test_cases.push({ name: 'Test_2', passed: true, description: '' })
  } catch (error) {
    test_cases.push({ name: 'Test_2', passed: false, description: ' from catch, something wrong in logic no such link' })
  }

  // Should show privacy policy
  try {
    const privacy_notice = await page.$('h2');
    const title = await page.evaluate(h2 => h2.textContent, privacy_notice);
    test_cases.push({ name: 'Test_2.1', passed: title === 'PRIVACY NOTICE', description: ' from try, reaching a property' })
    await privacy_notice.dispose();
  } catch (error) {
    test_cases.push({ name: 'Test_2.1', passed: false, description: ' from catch, something wrong in logic' })
  }

  /*
  Test number 3
  * Return to main page and pass dummy address
  * should be 404 page
  */

  // find a privacy policy link and click on it
  const close = '#close';
  await page.click(close);
  await page.goto('http://localhost:9515/dummy');
  const notfound = await page.$('div>h2:nth-child(2)');
  const title = await page.evaluate(h2 => h2.textContent, notfound);
  test_cases.push({ name: 'Test_3', passed: title === 'Page not found', description: ' Page not Found something wrong' })
  await notfound.dispose();

  /*
  Test number 4
  * Return to main page and login
  * should have 
  *  - cookies for session
  *  
  */

  // const from_404_to_main = ;
  // await page.click(from_404_to_main);
  await page.click('div>a');

  const userName = process.env.username_admin;
  // Type into search box
  await page.type('#username', userName, { delay: 100 });
  await page.type('#password', process.env.password_admin, { delay: 100 });

  // const submit_password = '#submit';
  // await page.click(submit_password);
  const submit_password = await page.$('#submit');
  await submit_password.click();

  const userHandle = await page.waitForSelector('.menu>p:nth-child(1)');
  const us_name = (await page.evaluate(el => el.textContent, userHandle)).trim();
  await userHandle.dispose();
  if (us_name) {
    console.log(' Login werer succesfull User with name:', us_name, ' is connected');
    test_cases.push({ name: 'Test_4.1', passed: us_name === userName, description: ' userName is not same as passed' })
  }

  /*
  Test number 5
  * check your settings
  * should 
  *  have a form for both admin and regular user
  *  have prefiled values in form same as properies in list
  *  can post and values should ne updated  
  */

  const settings = '.menu > p:nth-child(1) > a:nth-child(1)';
  await page.click(settings);


  let repeat = true;
  let again = 0
  while (again < 2) {
    // this is an array with all user properties
    const profile_eval = await page.$$eval('li', (array) => array.map(el => el.textContent));
    // Collect prop values from settings in object
    const user_prop = {}
    for (let el of profile_eval) {
      let position = el.search(':');
      user_prop[el.slice(0, position).replace(/\s/g, '')] = el.slice(position + 1).trim();
    }

    test_cases.push({ name: 'Test_5.' + (again + 1), passed: Boolean(Object.keys(user_prop)[0]), description: 'user_props are empty' });

    const form_values = await page.$$eval('input', (array) => array.map(el => el.value))
    let count_equal = 0;
    for (let key of Object.keys(user_prop)) {
      if (form_values.includes(user_prop[key])) count_equal += 1;
    }
    if (count_equal >= 2) test_cases.push({ name: 'Test_5.' + (again + 2), passed: true, description: '' });
    else test_cases.push({ name: 'Test_5.2', passed: false, description: 'there is less then 2 or none equalities in settings' });

    // do not repeat this
    if (repeat) {
      // clear and enter
      await page.click('#userAddress', { count: 3 });
      // await page.keyboard.down('Control');
      // await page.keyboard.press('A');
      // await page.keyboard.up('Control');
      // await page.keyboard.press('Backspace');
      await page.type('#userAddress', 'Address is added from Puppeteer', { delay: 100 });

      await page.click('#comments', { count: 3 });
      await page.type('#comments', 'Comments is changed from Pupeteer', { delay: 100 });
      await page.click(' form > input[type=submit]:nth-child(11)')
    }
    again += 1;
    repeat = false;
  }

  // create a pause uncommnent next line
  // new Promise(r => setTimeout(r, 5000));

  // // we can have a click on logout by it self
  // const logout = '.menu>p:nth-child(2) > a';
  // await page.click(logout);

  // comment this to close interaction from terminal
  // console.log('Browser\'s work is done, enter \'Browser close\' to exit :)');
  // process.stdin.on('data', data => {
  //   if (data.toString().substring(0, 13) === 'Browser close') {

  //     Promise.resolve(browser)
  //       .then(val => val.close())
  //       .then(() => {
  //         console.log("Browser is closed \n, Want to exit? : Yes / No")
  //       });
  //   }
  //   if (data.toString().substring(0, 3) === 'Yes') process.exit();
  // });


  // uncomment if You do not want interaction from terminal
  await browser.close();
  for (let test of test_cases) {
    console.log(test.name + ': ', test.passed ? ' passed' : 'failed')
    if (!test.passed) console.log(test.description);
  }

})();

