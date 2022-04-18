-- Full Set up -- 

Clone repo
Install Node.js - https://nodejs.org/en/download/ - Windows Installer (This will also install chocolatey, python, npm)
Restart
"npm install" from within main folder
run app with "npm start" from within main folder

-- End of full set up --


-- App Use --

To reload electron app after code updates:
ctrl + r from within app or view -> reload

-- End of App Use --


-- To do --

Current job
4-feature. Add more available content. Including images. Code. Headers. Links.
Restructure how adding new content works. 

Add further content:
Add Image Section
Add links sections

Commit message: 
"Enabled adding, deleting and editing Header Content. Created global so that keys for the json file could
be identified by the IDs. Restructured how Adding content works. Enabled additions of code sections. Added a very
simple img content adding feature. 

Unable to add a header section as content. Getting the keys was becoming complex and looked awful. Adding content was
done with individual functions for each type of content, which was messy and repeated code. 

Added in functionality to the Add header selection on the context menu for the page content. Created a global object
to store the id/ key values as getting keys for the json file was getting messy. Created an adding content function 
to handle adding all types of content. "



Next job =: 
6-feature. Enable highlight.js for the code entries. use npm to install.
5-feature. Format the return values so that it looks like a blog page.
1-bug. There seems to be an issue with adding a category name with a period in it. 
 

Future:
1. Enable pictures to be included.
2. Enable reorganise of content?


-- End of To do --

