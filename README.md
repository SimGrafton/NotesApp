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


4-feature. Edit text.

Commit message: 
"Enabled edit of content sections. Fixed Bugs. Re-architectured how the application responds after a change is made.

Content could not be edited, nor added to or deleted. System of content was either an info section or code section. 
When you opened the context menu, if too low in the app then all options were not viewable. When the JSON file is edited,
the app would display the changes without reloading from the json file, however, this created significantly increased 
complexity when adding new data and if many entries were added then it got worse. 

Content can now be edited and have implemented a system so that each bit of content has a unique name. Can now add
paragraph sections, delete and edit them. When JSON changes are made, app now refreshes and reopens at the location.
Added ipcmain and ipcrenderer processes to ensure context menu appears within browserwindow."

Current job

3-feature. Add more available content. Including images. Code. Headers. Links.
5-feature. Format the return values so that it looks like a blog page.

1-bug. There seems to be an issue with adding a category name with a period in it. 
 

Future:
1. Enable pictures to be included.
2. Enable reorganise of content?


-- End of To do --

