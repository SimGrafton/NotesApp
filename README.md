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


4-feature. Edit text. I'd like it so that when you do something like add a category or update text, that the screen
instantly makes the change and then in the background the update to the JSON happens. This will mean that eventlisteners
will need to be added, but I think as part of this it will make sense to clean the work up and have a function for 
adding a subcategory or finalcategory, which will handle adding the event listeners, or possibly so all the el's are
on classes. 

Commit message- "fixed bug where context menu would appear below the browserwindow (added ipcmain and ipcrenderer
processes to achieve.) Added in add new section which needs further work to enable dynamic section adding and moving"

Get rid of code section, just have info section but allow to display code section so that I can move it. Have alert.
There should be features at the top of the page, for edit, add picture, add code, add new, delete category.


3-feature. Adding more features to text. So should be able to read code and info, but then should have other boxes
Each FinalCategory should have
{
    orderNum: 1,
    mainText: ""
}

but then can add any of the following. Each can then have it's own way of adding. Can then add more here as well. Have 
these options display on page and on right click.

{
    paragraph: " ",
    header: "",
    image: " ",
    code: " ",
    link: " "
}

4-feature. Editing text
7-feature. Format the return values so that it looks like a blog page.

1-bug. There seems to be an issue with adding a category name with a period in it. 

Future:
1. Enable pictures to be included.



-- End of To do --

