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


2-Feature. 
Have created a context menu that pop up when you right click a div, which can be used for categories, menu, text. 
Have enabled moving categories up and down in the category menu on the left. Have added in global variables which hold
the json data, the current right click selection for editing purposes.
Have enabled editing of the category names.

Next:
XX Enable edit of text
saving new category. 
Get rid of code section, just have info section but allow to display code section so that I can move it. Have alert.
There should be features at the top of the page, for edit, add picture, add code, add new, delete category.


Add new category


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
5-feature. Adding and saving new category.
6-feature. Delete Category 
7-feature. Format the return values so that it looks like a blog page.

1-bug. When you click the menu on the bottom entries, it opens up out of clickable range, need to check if its on
screen and if not then position it higher up. Would be useful to have the position of the window size anyway. 

Future:
1. Enable pictures to be included.

-- End of To do --

