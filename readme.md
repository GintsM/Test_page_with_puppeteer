## Test webpage using Puppeteer

### Description
This project is to test web project on localhost (particular in reality, but that is in private repo).
Application at this mometn includes 
 - auth. page on success you are logged in
 - setting for user, user can change just minor properties
 - admin page (to visit need admin rights)
 - admin can create/delete/update_info for reguar user
 - admins settings same as regular user


There is no addition tools (like Mocha or similar), everything is performed using only puppeteer

### Use
If You read this, thanks for visiting my repository.
So as mentioned above this is writen for particular project so it will not out of box for you,
page uses cookies which browser uses to keep state, and to confirm test is passed there are search for particular html content
in page (which definetely are different in your),
so be ready to rewrite some parts  
To close browser need interaction from terminal, 
at this moment (september, 2023) command when done is `browser close` on conformation browser is closed, enter `Yes` to close process.stdin

### License
 
 is added to a project

### Questions

If you have any questions realted to this project, feel free to open new Issue, where leave your contacts, if you want to get direct response.