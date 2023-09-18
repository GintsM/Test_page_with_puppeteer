// import puppeteer from 'puppeteer';
var puppeteer = require('puppeteer');
require('dotenv').config();


(async () => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage();

  // Navigate the page to a URL
  await page.goto('http://localhost:9515');

  // Set screen size
  await page.setViewport({ width: 900, height: 900 });


  try {
    // accept page cokkies
    const accept_cookies = '#accept_cookies';
    await page.click(accept_cookies);

  } catch (error) {
    console.log('Same error, From accept cookies')
  }

  // Type into search box
  await page.type('#username', process.env.username_admin, { delay: 100 });
  await page.type('#password', process.env.password_admin, { delay: 100 });

  // const submit_password = '#submit';
  // await page.click(submit_password);
  const submit_password = await page.$('#submit');
  await submit_password.click();

  console.log('We have cookies: \n', 'Unkoment next 2 lines if You want to see them');
  // var cookies = await page.cookies();
  // console.log('Ccookies: \n', cookies);

  const userHandle = await page.waitForSelector('.menu>p:nth-child(1)');
  const us_name = await page.evaluate(el => el.textContent, userHandle);
  // await userHandle.dispose();
  if (us_name) console.log(' Login werer succesfull User with name:', us_name, ' is connected');
  else console.log('Continue to learn');

  // create a pause uncommnent next line
  // new Promise(r => setTimeout(r, 5000));

  // we can have a click on logout by it self
  const logout = '.menu>p:nth-child(2) > a';
  await page.click(logout);

  // comment this to close interaction from terminal
  console.log('Browser\'s work is done, enter \'Browser close\' to exit :)');
  process.stdin.on('data', data => {
    if (data.toString().substring(0, 13) === 'Browser close') {

      Promise.resolve(browser)
        .then(val => val.close())
        .then(() => {
          console.log("Browser is closed \n, Want to exit? : Yes / No")
        });
    }
    if (data.toString().substring(0, 3) === 'Yes') process.exit();
  });


  // uncomment if You do not want interaction from terminal
  // await browser.close();

})();

