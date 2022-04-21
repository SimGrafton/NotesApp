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
6-feature. Allow multiple notes files. And so you can select which one from inside the application. Can you save the
users information and which document they had open last? Even which page? Needs to get the file name and use as a link.
May need a cache file to store settings and get settings.

commit 
"Enabled multiple file use. Tabs along the top of the app now show all the notes files and you can switch between them. 
Created a settings file which stores the last opened text file for when the app is reset. Also stores the last opened
categories if needed. Changed how globalParsedNotes works and removed functions that opened files when the data was
already stored.


Next job =: 

Sort backups - have put one in onedrive
1-bug. Sometimes the delete category button is unresponsive. 
2-feature. Create new notes file. 

Future:
1. Test with other files
2. Enable reorganise of content?
3. Enable bold, italics, underline?
4. Enable dark mode?
5. Have this as a module that can be used in other products. So can have this as a tab in Trading app.
6. Publish as app
7. Output section as word file. Output entirety as pdf or word file. 


-- End of To do --

