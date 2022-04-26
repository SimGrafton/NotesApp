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

-- Building .exe --

Installed - "npm install electron-packager -g"
electron-packager NotesApp notesapp --platform=win32 --arch=x64 --overwrite --icon=NotesApp/NotesAppIcon.ico --out="C:\Program Files (x86)\MyLocalNotesApplication"

-- End of Building .exe --

-- Packaging file into installer --
Use installForge
Add files
Product Name = "MyLNotes"
System - shortcuts to create shortcut
-- Building .exe --

-- To do --

Current job
1-publish. Publish as app.


commit 
"Created installforge file for packaging into installer. Tested with electron-packager and made node and npm changes
to ensure packagable and to address errors, for example with the file system plugin which is now included in node.js.
Cleaned up files  and made changes to location of users files and backups. Notes files are now in the users documents. 
Created function to get the users folder on pc.

Next job =: 

Test for a while
Create an msi to install file in specific location. Need to make sure the file has read & write access and 
creates desktop shortcut. - Trying install forge.
Change app icon
Sort git backups - have put one in onedrive
1-bug. Sometimes the delete category button is unresponsive.
1-improvement. Add proper button icons for all the context menu options. 
Change the top dropdown to be more dynamic, if you click off of it it needs to minimise. The 
icons also needs to be set to not move if it drops down. 
A check for updates button (then would need to have it hosted online).
Automate the build package and installer creation process?
Security, have something that checks a checksum before opening? Saying files appear to have been edited. Please 
redownload.
Create tests for everything you do. So create file, delete file, enter content etc.... Then can run all when you change
something.
Change icon so it isnt white
Remove first dropdown of categories, it's clunky when you first start
Change the design of the top tab bar
Change layout of the category bar so that longer finalcategories are displayed better

Future:
1. Enable dark mode
2. Enable status section. This will show yellow when doing something and will have a dropdown that shows more details.
Green then when everything is a okay. Or could be like a loading symbol. 
2. Enable reorganise of content?
3. Enable bold, italics, underline?
4. Enable dark mode?
5. Have this as a module that can be used in other products. So can have this as a tab in Trading app.
So there should be a main app, which is just the electron. Then you can add modules, which is essentially just
adding an index page. For this to work, the modules would have to not clash.
6. Publish as app
7. Output section as word file. Output entirety as pdf or word file. 


-- End of To do --

