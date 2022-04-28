-- Full Development Set up -- 

Clone repo
Install Node.js - https://nodejs.org/en/download/ - Windows Installer (This will also install chocolatey, python, npm)
Restart
"npm install" from within main folder
run app with "npm start" from within main folder

-- End of full set up --

-- Other relevant information -- 

Backups are stored in D drive - backups
github is "https://github.com/SimGrafton/NotesApp.git"

-- End of Other relevant information --


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
Product Name = "MyLocalNotesApp"
System - shortcuts to create shortcut, add icon to shortcut
-- End of packaging file into installer --

-- To do --

Current job:
1-improvement. 
- Change the top bar so that if you add too many notes files that they move into the dropdown.
- Change the top dropdown to be more dynamic, if you click off of it it needs to minimise. The 
icons also needs to be set to not move if it drops down. Change the design of the top tab bar. 


commit - 
"Change top toggle bar drowndown to always stay as dropdown and aligned icons to right. Changed
notes title above the categories to read the title of the notes. Changed the NotesApp name to My
Local Notes App "

Next jobs: 
Allow the change of the notes location, so that you can use onedrive and sync the notes.
Short categories are appearing on the same line
Icon for shortcut isnt working
drag needs to be whole top bar
Remove inspect element
1. Test for a while
2. Change app icon so it isnt white
3. 1-bug. Sometimes the delete category button is unresponsive.
4. 1-improvement. Add proper button icons for all the context menu options. 

Future jobs:
1. Enable dark mode
2. Enable status section. This will show yellow when doing something and will have a dropdown that shows more details.
Green then when everything is a okay. Or could be like a loading symbol. 
4. Enable reorganise of content?
5. Enable bold, italics, underline?
6. Have this as a module that can be used in other products. So can have this as a tab in Trading app.
So there should be a main app, which is just the electron. Then you can add modules, which is essentially just
adding an index page. For this to work, the modules would have to not clash.
7. Publish as app
8. Output section as word file. Output entirety as pdf or word file. 
9. A check for updates button (then would need to have it hosted online)
10. Automate the build package and installer creation process?
11. Security, have something that checks a checksum before opening? Saying files appear to have been edited. Please 
redownload.
12. Create tests for everything you do. So create file, delete file, enter content etc.... Then can run all when you change
something.
-- End of To do --

