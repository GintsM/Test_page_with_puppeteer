// import puppeteer from 'puppeteer';
var puppeteer = require('puppeteer');


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
  await page.type('#username', 'GintsM', { delay: 100 });
  await page.type('#password', 'Pozitivs@383', { delay: 100 });

  const submit_password = '#submit';
  await page.click(submit_password);

  var cookies = await page.cookies();
  console.log('We have cookies: \n', 'Unkoment next line if You want to see them');
  // console.log('Ccookies: \n', cookies);

  // .menu > p:nth-child(1) css for username
  // let username = '';
  // try {
  //   username = await page.waitForSelector('.menu>p:nth-child(1)')
  // } catch (error) {
  //   console.log('Error on username')
  // }
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

  // console.log(logout, " Logout");
  console.log('Probably you need to enter something :)');
  process.stdin.on('data', data => {
    // console.log(`You typed ${data.toString()}`);
    let browser_closed = false;
    if (data.toString().substring(0, 13) === 'Browser close') {

      Promise.resolve(browser)
        .then(val => val.close())
        .then(() => {

          console.log("Browser is closed \n, Want to exit? : Yes / No", browser_closed = true)
        });
    }
    console.log('Browser_closed ', browser_closed);
    if (browser_closed && data.toString().substring(0, 3) === 'Yes') process.exit();
  });



  // await browser.close();

})();

// process.stdin.on('data', data => {
//   console.log(`You typed ${data.toString()}`);
//   if (data === 'Yes') process.exit();
// });

