// This doc manages the json files, imports the names into the app and opens different notes files

const fs = require('fs'); 

 // Needs to read all the .json files with Data, display the file titles in the title bar and open when you click one.
LoadFilesAndTabs(); 
var globalCurrentFile; 
var globalSettings = {
    "currentFile":"",
    "currentCategory":"",
    "currentSubCategory":"",
    "currentFinalCategory":"",
    "currentDir": ""};
var globalFileNames; 

// Get the path of user into globalUserPath
GetHomePath(); 

async function LoadFilesAndTabs()
{
    

    if(!globalUserPath) // If GetHomePath() has not yet set the users path then do not continue.
    {

        console.log("Awaiting receipt of users documents path"); 
        setTimeout(function () {
            GetHomePath(); 
            LoadFilesAndTabs(); 
        }, 500);
        return; 
    };

    // Clear tabs
    
    $(`#navTabs`).empty(); 
    

    const getFilesPromise = GetFiles(); 
    const getSettingsPromise = GetJSONFromFile(`${globalUserPath}/Documents/MyLocalNotesApp/data/userSettings/settings.txt`); 

    Promise.all([getFilesPromise, getSettingsPromise]).then(function(values){

        // values[0] should be the data files as an array and values[1] should be settings file as json

        // If no data file, create
        if(!values[0])
        {
            // Should mean this is the first time start, so need to create the folders and restart process      
            FirstTimeSetupAndRestart(); 
            return; 
        }
    
        // If no settings file, create
        if(!values[1])
        {
            // Create settings file
            let data = {
                "currentFile":"",
                "currentCategory":"",
                "currentSubCategory":"",
                "currentFinalCategory":"",
                "currentDir": ""};
            CreateFile(`${globalUserPath}/Documents/MyLocalNotesApp/data/userSettings/settings.txt`, data);
        }

        // If no files then returns
        if(values[0].length == 0)
        {
            
                // Add icon for adding new file
            $(`#navTabs`).append(`<li class=""><a class="clickCursor" id="addNewFile" title="Add new notes file"><img src="icons/addWhite.png" style="height: 20px;" /></a></li>`); 

            // Set event listeners
            $(`#addNewFile`).click(AddNewFile);
            return; 
        }

        // Set the tabs as the different files names

        // Remove the .txt or .json
        globalFileNames = values[0];
        let fileNames = []; 
        values[0].forEach(function(file){
            fileNames.push(RemoveFileSuffix(file));
        });


        // Load the fileNames as links in tabs
        let p = 0; 
        for(let i in values[0])
        {
            $(`#navTabs`).append(`<li class="nav-item"><a class="nav-link fileTabs clickCursor" title="Open file" id="${fileNames[p]}">${fileNames[p]}</a></li>`); 

            p++; 
        };

        // Add icon for adding new file
        $(`#navTabs`).append(`<li class=""><a class="clickCursor" id="addNewFile" title="Add new notes file"><img src="icons/addWhite.png" style="height: 20px;" /></a></li>`); 

        // Set event listeners
        $(`.fileTabs`).click(OpenFile); 
        $(`#addNewFile`).click(AddNewFile);
        $(`.fileTabs`).contextmenu(DisplayTabContextMenu); 

        if(values[1])
        {
            globalSettings = values[1];

            // Add class "active" to a section if current. Check from the settings
            let id = RemoveFileSuffix(values[1]["currentFile"]); 
            $(`#${id}`).addClass(`active`);
            $(`#documentName`).html(`${id}:`); 

            globalCurrentFile = values[1]["currentFile"]; 

            LoadCategoriesIntoSidebar(values[1]["currentFile"]); 
        }
    }); 

}

 // Read the files
async function GetFiles()
{
    return new Promise(resolve => {

        // joining path of directory 
        //const directoryPath = path.join(".", 'data');
        // passsing directoryPath and callback function
        fs.readdir(`${globalUserPath}/Documents/MyLocalNotesApp/data`, function (err, files) {
            // handling error
            if (err) {
                console.log(`Unable to scan directory. The error is: ` + err)
                resolve (false);
            } 

            // listing all files using forEach
            let filesUpdated = []; 
            if(files == undefined)
            {
                resolve(false);
            }
            else 
            {
                files.forEach(function (file) {
                    // If it's a .txt or json file then add to array
                    if(file.includes(`.txt`)||file.includes(`.json`))
                    {
                        filesUpdated.push(file);
                    }
                });
                
                resolve (filesUpdated); 
            }
            
            

        });
		
	})

}

function RemoveFileSuffix(fileName)
{
    if(fileName.includes(`.txt`)||fileName.includes(`.json`))
    {
        return fileName.substring(0, fileName.indexOf(".txt"));
    } else if (fileName.includes(`.json`)) {
        return fileName.substring(0, fileName.indexOf(".json"));
    }
    else {
        return fileName; 
    }
}

function OpenFile()
{
    // Get the id
    let id = this.id + ".txt"; 

    // Close dropdown
    $('#navBarButton').click();

    // Set title of categories to notes doc
    $(`#documentName`).html(`${this.id}:`); 
    
    LoadCategoriesIntoSidebar(id);
    globalCurrentFile = id; 
    UpdateSettingsFile("currentFile", id); 
    $(`.fileTabs`).removeClass(`active`);
    $(`#${this.id}`).addClass(`active`); 
}

function AddNewFile()
{
    // Add in text area for title
    $(`#addNewFile`).replaceWith(`<textarea class="form-control p-0 mb-1" id="newNotesFileName" placeholder="Enter notes file name..." rows="1" style="min-width: 100px;"></textarea>
    <button class="btn btn-primary btn-sm mb-2" id="submitAddNewFile">Ok</button>
    <button class="reloadBtn btn btn-primary btn-sm mb-2" id="cancelAddNewFile">Cancel</button>`); 

    // Add Event Listeners
    $(`#submitAddNewFile`).click(SubmitAddNewFile);
    $(`#cancelAddNewFile`).click(CancelAddNewFile);
}

function SubmitAddNewFile()
{
    // Get entered notes name
    let newNotesFileName = $(`#newNotesFileName`).val(); 
    

    // Check is longer than length 2
    if(!VerfifyTextEntry(newNotesFileName))
    {
        return; 
    }

    // Remove spaces and letters
    newNotesFileName = RemoveSpaces(newNotesFileName);

    // Add suffix
    newNotesFileName += ".txt"; 

    // Check if file exists
    if(globalFileNames)
    {
        if(globalFileNames.includes(newNotesFileName))
        {
            OutputError("File exists");
            return; 
        }
    }
    
    // Use title to create file in data dir
    // Set globalCurrentFile
    globalCurrentFile = newNotesFileName; 
    let newFile = {}; 
    UpdateJsonFile(newFile); 

    // Refresh app and open new file

    LoadFilesAndTabs();  

}

function CancelAddNewFile()
{
    $(`#newNotesFileName`).remove();
    $(`#submitAddNewFile`).remove(); 
    $(`#cancelAddNewFile`).remove();  
    $(`#navTabs`).append(`<li class=""><a class="clickCursor" id="addNewFile" title="Add new notes file"><img src="icons/addWhite.png" style="height: 20px;" /></a></li>`); 
    $(`#addNewFile`).click(AddNewFile);
}

function DisplayTabContextMenu(e){

    let id = e.currentTarget.id + ".txt"
    // Set position of menu to mouse click
    var posX = e.clientX;
    var posY = e.clientY;

    $(`#menu`).html(""); // refresh the context menu
    menu(posX, posY);
    e.preventDefault();

    $('#menu').css('z-index', 9999); 

    $(`#menu`).append(`<a href="#" id="btnDeleteFile"><img src="icons/icons8-edit-50.png" />Delete file</a>`);
    $(`#btnDeleteFile`).click(function()
    {
        DeleteFile(id);
    }); 

    $(`#menu`).append(`<a href="#" id="btnBackupFiles"><img src="icons/icons8-edit-50.png" />Backup all files</a>`);
    $(`#btnBackupFiles`).click(function()
    {
        BackupFiles();
    }); 
}

function DeleteFile(id)
{
    globalFileNames.splice(globalFileNames.indexOf(id), 1);

    fs.unlink(`${globalUserPath}/Documents/MyLocalNotesApp/data/${id}`, function(){
        LoadFilesAndTabs();  
    }); 

    
}

function BackupFiles()
{
    // Copy data folder into dataBackups folder
    for(let i in globalFileNames)
    {
        fs.copyFile(`${globalUserPath}/Documents/MyLocalNotesApp/data/${globalFileNames[i]}`, `${globalUserPath}/Documents/MyLocalNotesApp/dataBackups/backup${globalFileNames[i]}`, (err) => {
            if (err) throw err;
            console.log('File was copied to destination');
          });
    }
}
    
async function FirstTimeSetupAndRestart()
{

    // Create data folder with subfolder of userSettings then restart process

    globalUserPath; 

    await fs.promises.mkdir(`${globalUserPath}/Documents/MyLocalNotesApp/data/userSettings`, { recursive: true }).then(function(){
        LoadFilesAndTabs(); 
    });
}