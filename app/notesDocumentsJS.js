// This doc manages the json files, imports the names into the app and opens different notes files

 // Needs to read all the .json files with Data, display the file titles in the title bar and open when you click one.
LoadFilesAndTabs(); 
var globalCurrentFile; 
var globalSettings; 
async function LoadFilesAndTabs()
{

    const getFilesPromise = GetFiles(); 
    const getSettingsPromise = GetJSONFromFile("app/settings.txt"); 

    Promise.all([getFilesPromise, getSettingsPromise]).then(function(values){
    
        // Set the tabs as the different files names

        // Remove the .txt or .json
        let fileNames = []; 
        values[0].forEach(function(file){
            fileNames.push(RemoveFileSuffix(file));
        })

        // Load the fileNames as links in tabs
        let p = 0; 
        for(let i in values[0])
        {
            $(`#navTabs`).append(`<li class="nav-item"><a class="nav-link fileTabs" id="${fileNames[p]}">${fileNames[p]}</a></li>`); 

            p++; 
        };


        globalSettings = values[1];
        // Add class "active" to a section if current. Check from the settings
        let id = RemoveFileSuffix(values[1]["currentFile"]); 
        $(`#${id}`).addClass(`active`);

        // Set event listener
        $(`.fileTabs`).click(OpenFile); 

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