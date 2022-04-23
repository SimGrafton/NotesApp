// This doc manages the json files, imports the names into the app and opens different notes files

 // Needs to read all the .json files with Data, display the file titles in the title bar and open when you click one.
LoadFilesAndTabs(); 
var globalCurrentFile; 
var globalSettings; 
var globalFileNames; 
async function LoadFilesAndTabs()
{
    // Clear tabs

    $(`#navTabs`).empty(); 

    const getFilesPromise = GetFiles(); 
    const getSettingsPromise = GetJSONFromFile("app/settings.txt"); 

    Promise.all([getFilesPromise, getSettingsPromise]).then(function(values){
    
        // Set the tabs as the different files names

        // Remove the .txt or .json
        globalFileNames = values[0];
        let fileNames = []; 
        values[0].forEach(function(file){
            fileNames.push(RemoveFileSuffix(file));
        })

        // Load the fileNames as links in tabs
        let p = 0; 
        for(let i in values[0])
        {
            $(`#navTabs`).append(`<li class="nav-item"><a class="nav-link fileTabs clickCursor" title="Open file" id="${fileNames[p]}">${fileNames[p]}</a></li>`); 

            p++; 
        };

        // Add icon for adding new file
        $(`#navTabs`).append(`<li class=""><a class="clickCursor" id="addNewFile" title="Add new notes file"><img src="icons/addWhite.png" style="height: 20px;" /></a></li>`); 


        globalSettings = values[1];
        // Add class "active" to a section if current. Check from the settings
        let id = RemoveFileSuffix(values[1]["currentFile"]); 
        $(`#${id}`).addClass(`active`);

        // Set event listeners
        $(`.fileTabs`).click(OpenFile); 
        $(`#addNewFile`).click(AddNewFile);
        $(`.fileTabs`).contextmenu(DisplayTabContextMenu); 

        globalCurrentFile = values[1]["currentFile"]; 

        LoadCategoriesIntoSidebar(values[1]["currentFile"]); 

    }); 

}

 // Read the files
async function GetFiles()
{
    return new Promise(resolve => {

        // joining path of directory 
        const directoryPath = path.join(".", 'data');
        // passsing directoryPath and callback function
        fs.readdir(directoryPath, function (err, files) {
            // handling error
            if (err) {
                resolve (console.log('Unable to scan directory: ' + err));
            } 

            // listing all files using forEach
            let filesUpdated = []; 
            files.forEach(function (file) {
                // If it's a .txt or json file then add to array
                if(file.includes(`.txt`)||file.includes(`.json`))
                {
                    filesUpdated.push(file);
                }
            });
            
            resolve (filesUpdated); 

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

    // Add suffix
    newNotesFileName += ".txt"; 

    // Check if file exists
    if(globalFileNames.includes(newNotesFileName))
    {
        OutputError("File exists");
        return; 
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
}

function DeleteFile(id)
{
    console.log(id)

    fs.unlink(`data/${id}`, function(){
        LoadFilesAndTabs();  
    }); 

    
}
