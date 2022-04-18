// Runs after inclusion
LoadCategoriesIntoSidebar(); 

// Declare globals

var parsedNotes; // the notes in parsed json returned from opening the main file

var globalCategoryMap = []; // Object which contains every category by it's id, so that the details can be found by searching for the ID only, 
// instead of navigating through divs and adding all the details to each div
var globalSubCategoryMap = [];
var globalFinalCategoryMap = [];

var globalNameMap = []; // Samilar to above but using the name instead of the ID

// Globals for the current category being edited/ addressed
var globalID;

var globalCategoryID;
var globalSubCategoryID;
var globalFinalCategoryID;
var globalCategoryType; 
var globalCategoryName;

var globalNum = 10000; 

var globalCategoryNumberCheck; 

async function LoadCategoriesIntoSidebar()
{

    RefreshGlobals();
    RefreshIndexData();

    $(`#collapseNotes`).html(``); 
    
    await GetCategories().then(function(response){
        let catCount = 0;
        let subCatCount = 500;
        let finalCatCount = 1000;
        let number = 0; 

        for(let i in response)
        {   
            let category = i;
            let categoryID = `${RemoveSpaces(i)}${catCount}`;
            let categoryDropdownID = `subCategoriesOf${categoryID}`;

            AddCategory(category, categoryID, categoryDropdownID);

            // Add entry to globalMap
            globalCategoryMap[categoryID] = {
                categoryName: category,
                categoryType : "category",
                ID : categoryID,
                subCategoryIDs :[],
                numbering : number
            }; 

            // Add entry to globalNameMap
            globalNameMap[category] = {
                categoryID: categoryID,
                categoryType : "category",
                numbering : number
            }; 

            number += 1; 

            let number2 = 0; 

            for(let j in response[i]){

                let subCategory = j;
                let subCategoryID = `${RemoveSpaces(j)}${subCatCount}`;
                let subCategoryDropdownID = `finalCategoriesOf${subCategoryID}`; 

                AddSubCategory(subCategory, subCategoryID, categoryDropdownID, subCategoryDropdownID); 

                // Add entry to globalMap
                globalSubCategoryMap[subCategoryID] = {
                    categoryName: subCategory,
                    categoryType : "subCategory",
                    ID : subCategoryID,
                    subCategoryIDs :[],
                    parentCategoryID : categoryID, 
                    numbering : number2
                }; 

                globalNameMap[subCategory] = {
                    categoryID: subCategoryID,
                    categoryType : "subCategory",
                    numbering : number2
                }; 

                number2 += 1;

                globalCategoryMap[categoryID]["subCategoryIDs"].push(subCategoryID);

                let number3 = 0;

                for(let k in response[i][j]){

                    let finalCategory = k;
                    let finalCategoryID = `${RemoveSpaces(k)}${finalCatCount}`;
                    
                    AddFinalCategory(finalCategory, finalCategoryID, subCategoryDropdownID);

                    // Add entry to globalMap
                    globalFinalCategoryMap[finalCategoryID] = {
                        categoryName: finalCategory,
                        categoryType : "finalCategory",
                        ID : finalCategoryID,
                        parentCategoryID : subCategoryID,
                        parentParentCategoryID : categoryID,
                        numbering : number3
                    }; 

                    globalNameMap[finalCategory] = {
                        categoryID: finalCategoryID,
                        categoryType : "finalCategory",
                        numbering : number3
                    }; 

                    number3 += 1; 

                    globalSubCategoryMap[subCategoryID]["subCategoryIDs"].push(finalCategoryID);

                    finalCatCount += 1;
                    
                }

                number3 = 0;

                subCatCount += 1;
                
            }

            number2 = 0; 

            catCount += 1; 

        }

        // Event Listeners
        AddCategoryEventListeners(); 

    })

}

function AddCategoryEventListeners()
{

    $(`.category`).contextmenu(DisplayContextMenu); 

    $(`.subCategory`).contextmenu(DisplayContextMenu); 

    $(`.finalCategory`).click(DisplayCategoryPage); 

    $(`.finalCategory`).contextmenu(DisplayContextMenu); 

    $(`.btnCategoryHeader`).contextmenu(DisplayHeaderContextMenu);
}

function RefreshGlobals()
{
    parsedNotes = "";

    globalCategoryMap = [];
    globalSubCategoryMap = [];
    globalFinalCategoryMap = [];

    globalNameMap = [];
    globalID = "";

    globalCategoryID = "";
    globalSubCategoryID = "";
    globalFinalCategoryID = "";
    globalCategoryType = ""; 
    globalCategoryName = "";

}

function DisplayContextMenu(e){

    GetWindowSize(); 

    // Set position of menu to mouse click
    var posX = e.clientX;
    var posY = e.clientY;

    if(globalWindowSize != undefined){
        if(globalWindowSize[1] - e.clientY < 200 ){
            posY = globalWindowSize[1] - 250; 
        }
    }

    $(`#menu`).html(""); // refresh the context menu
    menu(posX, posY);
    e.preventDefault();

    // Get the details from the globalMap
    let current;
    let typeArray = [
        globalCategoryMap[this.id],
        globalSubCategoryMap[this.id],
        globalFinalCategoryMap[this.id],
    ];

    // Set global type for future reference
    for(let i of typeArray){
        if(i != undefined){
            current = i;
            globalCategoryType = current.categoryType;
            break;
        }
    }; 

    // Set global type for future reference
    globalID = this.id;    

    if(globalCategoryType == "category")
    {
        // Set globals
        globalCategoryID = this.id;

        globalCategoryName = globalCategoryMap[globalID].categoryName;

        // Add event listener to add button
        $(`#menu`).append(`<a href="#" id="btnAddNewCategory"><img src="icons/icons8-edit-50.png" />Add New Subcategory</a>`);
        $(`#btnAddNewCategory`).click(AddNewCategory); 

    } else if (globalCategoryType == "subCategory")
    {
        // Set globals
        globalCategoryID = current.parentCategoryID;
        globalSubCategoryID = this.id; 

        globalCategoryName = globalSubCategoryMap[globalID].categoryName;

        // Add labels to context menu
        $(`#addFinalCategory`).html(`Add new category to "${this.value}"`);

        // Add event listener to add button
        $(`#menu`).append(`<a href="#" id="btnAddNewCategory"><img src="icons/icons8-edit-50.png" />Add New Subcategory</a>`);
        $(`#btnAddNewCategory`).click(AddNewCategory); 

    } else if (globalCategoryType == "finalCategory")
    {
        // Set globals
        globalCategoryID = current.parentParentCategoryID;
        globalSubCategoryID = current.parentCategoryID;
        globalFinalCategoryID = this.id;

        globalCategoryName = globalFinalCategoryMap[globalID].categoryName;
    } 

   
    $(`#menu`).append(`<a href="#" class="btnEditContextMenu"><img src="icons/icons8-edit-50.png" /><div class="editCategory"></div></a>`);
    $(`#menu`).append(`<a href="#"><img src="icons/icons8-delete-24.png" /><div class="deleteCategory"></div></a>`);
    $(`#menu`).append(`<a href="#" class="inspectElement"><img src="icons/add.png" />Inspect Element</a>`);
    $(`#menu`).append(`<a href="#" class="reorderUp"><img src="icons/add.png" />Reorder Up</a>`);
    $(`#menu`).append(`<a href="#" class="reorderDown"><img src="icons/add.png" />Reorder Down</a>`); 

    // Add labels to context menu
    $(`.editCategory`).html(`Edit category name "${this.value}"`); 
    $(`.deleteCategory`).html(`Delete category "${this.value}"`); 

    // Add event listener to edit button
    $(`.btnEditContextMenu`).click(EnableEditCategoryName); 

    // Add event listener to delete button
    $(`.deleteCategory`).click(DeleteCategory); 

    // Add event listener to inspect button
    $(`.inspectElement`).click(ConsoleLogHTML); 

    // Add event listener to reorder buttons
    $(`.reorderDown`).click(ReorderCategoriesDown);
    $(`.reorderUp`).click(ReorderCategoriesUp); 

    globalCategoryNumberCheck = Object.keys(globalCategoryMap).length + Object.keys(globalSubCategoryMap).length + Object.keys(globalFinalCategoryMap).length;

}

function DisplayHeaderContextMenu(e)
{
    // Set position of menu to mouse click
    var posX = e.clientX;
    var posY = e.clientY;
    $(`#menu`).html(""); // refresh the context menu
    menu(posX, posY);
    e.preventDefault();

    $(`#menu`).append(`<a href="#" id="btnAddNewCategory"><img src="icons/icons8-edit-50.png" />Add New Category</a>`);

    globalCategoryType = "topCategory"; 
    $(`#btnAddNewCategory`).click(AddNewCategory); 

}

function AddNewCategory()
{
    // Add a new block with the text entry 

    if ($(`#NewCategoryName`).html() == undefined) {
        if (globalCategoryType == "topCategory") {
            // Needs to open up collapse notes - click the notes button?
            $("#collapseNotes").append(`<textarea class="form-control p-0 mb-1" id="NewCategoryName" placeholder="Enter new category..." rows="1" style="min-width: 100px;"></textarea>
            <button class="btn btn-primary btn-sm mb-2" id="submitEdit">Ok</button>
            <button class="reloadBtn btn btn-primary btn-sm mb-2" id="cancelEdit">Cancel</button>`);

        } else if (globalCategoryType == "category") {
            $(`#subCategoriesOf${globalID}`).append(`<textarea class="form-control p-0 mb-1" id="NewCategoryName" placeholder="Enter new category..." rows="1" style="min-width: 100px;"></textarea>
            <button class="btn btn-primary btn-sm mb-2" id="submitEdit">Ok</button>
            <button class="reloadBtn btn btn-primary btn-sm mb-2" id="cancelEdit">Cancel</button>`);

        } else if (globalCategoryType == "subCategory") {

            $(`#finalCategoriesOf${globalID}`).append(`<textarea class="form-control p-0 mb-1" id="NewCategoryName" placeholder="Enter new category..." rows="1" style="min-width: 100px;"></textarea>
            <button class="btn btn-primary btn-sm mb-2" id="submitEdit">Ok</button>
            <button class="reloadBtn btn btn-primary btn-sm mb-2" id="cancelEdit">Cancel</button>`);

        } else if (globalCategoryType == "finalCategory") {
            alert("Cannot add further subcategory");
            CancelEdit();

        }
        else {
            console.log("globalCategoryType not set"); 
        }

        // Open dropdown
        if(globalCategoryType != "topCategory" && $(`#${globalID}`).attr("aria-expanded") == "false")
        {
            $(`#${globalID}`).click();
        }; 
        
        // Add event listener to Ok
        $(`#submitEdit`).click(function (e) {

            let category = $(`#NewCategoryName`).val();

            // Check category is not empty
            if (category.length < 1) {
                alert("Please enter text");

                $(`#NewCategoryName`).remove();
                $(`#submitEdit`).remove();
                $(`#cancelEdit`).remove();

                return;

            }

            // Add the category to the category list
            if (globalCategoryType == "topCategory") {
                
                // Add category with categoryName, newCategoryID
                globalNum += 1; 
                AddNewCategoryToJson(category, `${RemoveSpaces(category)}${globalNum}`);
                globalCategoryType = "category";
                globalID = `${RemoveSpaces(category)}${globalNum}`;
                
                
            } else if (globalCategoryType == "category") {

                globalNum += 1; 
                AddNewCategoryToJson(category, `${RemoveSpaces(category)}${globalNum}`);
                globalCategoryType = "subCategory";
                globalID = `${RemoveSpaces(category)}${globalNum}`;
                

            } else if (globalCategoryType == "subCategory") {

                globalNum += 1; 
                AddNewCategoryToJson(category, `${RemoveSpaces(category)}${globalNum}`);
                globalCategoryType = "finalCategory";
                globalID = `${RemoveSpaces(category)}${globalNum}`;
                
                
            }

            // This prevents the event from bubbling
            e.stopPropagation();

        })

        // Add event listener to cancel
        $(`#cancelEdit`).click(function (e) {

            $(`#NewCategoryName`).remove();
            $(`#submitEdit`).remove();
            $(`#cancelEdit`).remove();

            // This prevents the event from bubbling, so that the parent button will not activate and therefore the page will not display when clicking
            e.stopPropagation();
        })
    }
    else{
        
        return console.log("Category already being added"); 
    }


};

function DeleteCategory() 
{
    console.log("Deleting button clicked");
    //if (confirm(`are you sure you want to delete category ${globalCategoryName}?`)) { // This was causing the focus to be removed when adding new category after deleting
        $(`#${globalID}`).remove();
        $(`#subCategoriesOf${globalID}`).remove();
        $(`#finalCategoriesOf${globalID}`).remove();
        
        DeleteCategoryFromJson();
    //};

}

async function ReorderCategoriesDown()
{
    
    let global;
    let catLength; 
    if(globalCategoryType == "category") 
    {
        global = globalCategoryMap;
        catLength = Object.keys(globalCategoryMap).length; 
    } else if (globalCategoryType == "subCategory")
    {

        global = globalSubCategoryMap; 
        catLength = globalCategoryMap[globalSubCategoryMap[globalID].parentCategoryID].subCategoryIDs.length;

    } else if (globalCategoryType == "finalCategory")
    {
        global = globalFinalCategoryMap; 
        catLength = globalSubCategoryMap[globalFinalCategoryMap[globalID].parentCategoryID].subCategoryIDs.length;
    } else 
     {
         console.log("globalCategoryType not defined");
     }
    

    if(global[globalID].numbering + 1 < catLength){

        // decrement current number category 
        let oldNbr = Object.keys(global).indexOf(globalID);
        let old = Object.keys(global)[oldNbr + 1];

        global[old].numbering = global[old].numbering - 1;
    
        // increment previous
        global[globalID].numbering = global[globalID].numbering + 1; 

        // Recreate json file
        ReconstructJson(); 

    }
    else{
        alert("Cannot lower as entry is bottom of list");
    }
    
}

async function ReorderCategoriesUp()
{

    let global;
    let catLength; 
    switch(globalCategoryType) {
        case "category":
            global = globalCategoryMap;
            catLength = Object.keys(globalCategoryMap).length;  
            break;
        case "subCategory":
            global = globalSubCategoryMap; 
            catLength = globalCategoryMap[globalSubCategoryMap[globalID].parentCategoryID].subCategoryIDs.length;
            break;
        case "finalCategory":
            global = globalFinalCategoryMap; 
            catLength = globalSubCategoryMap[globalFinalCategoryMap[globalID].parentCategoryID].subCategoryIDs.length;
            break;
        default:
    }

    
    let numToChangeTo = global[globalID].numbering - 1; 
    if(numToChangeTo >= 0){

        // decrement current number category 
        let oldNbr = Object.keys(global).indexOf(globalID);
        let old = Object.keys(global)[oldNbr - 1];

        global[old].numbering = global[old].numbering + 1;
    
        // increment previous
        global[globalID].numbering = global[globalID].numbering - 1; 

        // Recreate json file
        ReconstructJson();

    }
    else{
        alert("Cannot raise as entry is top of list");
    }
    
}

function EnableEditCategoryName(){

    // Get Category Name using type
    let catName; 
    switch(globalCategoryType) {
        case "category":
            catName = globalCategoryMap[globalID].categoryName; 
            break;
        case "subCategory":
            catName = globalSubCategoryMap[globalID].categoryName; 
            break;
        case "finalCategory":
            catName = globalFinalCategoryMap[globalID].categoryName; 
            break;
        default:
              // code block
    }

    // Replace the category name entry with a text box
    let old = $(`#${globalID}`).html(); 


    $(`#${globalID}`).html(`<textarea class="form-control p-0 mb-1" id="NewCategoryName" rows="1" style="min-width: 100px;">${catName}</textarea>
    <button class="btn btn-primary btn-sm mb-2" id="submitEdit">Ok</button>
    <button class="reloadBtn btn btn-primary btn-sm mb-2" id="cancelEdit">Cancel</button>`);

    // Add event listener to Ok
    $(`#submitEdit`).click(function(e){

        EditCategoryNameInJson($(`#NewCategoryName`).val()); 

        // This prevents the event from bubbling
        e.stopPropagation();
    })

    // Add event listener to cancel
    $(`#cancelEdit`).click(function(e){

        CancelEdit(`#${globalID}`, old); 

        // This prevents the event from bubbling, so that the parent button will not activate and therefore the page will not display when clicking
        e.stopPropagation();
    })

}

async function CancelEdit(id, oldEntry){

    $(id).html(oldEntry); 
    
}

// Gets the category names and uses function from displayPageJS.js
function DisplayCategoryPage(){

    globalFinalCategoryID = this.id;
    globalSubCategoryID = globalFinalCategoryMap[globalFinalCategoryID].parentCategoryID; 
    globalCategoryID = globalFinalCategoryMap[globalFinalCategoryID].parentParentCategoryID; 
    DisplayContent(globalCategoryMap[globalCategoryID].categoryName, globalSubCategoryMap[globalSubCategoryID].categoryName , globalFinalCategoryMap[globalFinalCategoryID].categoryName); 

}

// Gets all the categories from the json file
async function GetCategories()
{
    return new Promise(resolve => {

		let categories = []; 

		fs.readFile("data/MyNotesJson.txt", 'utf8', function (err, notes) {
			if (err) {
				console.log("An error has occurred opening json storage file: " + err);
			}
			else {
                // Parse return data and save to global variable
                parsedNotes = JSON.parse(notes); 

				resolve (parsedNotes); 
			} 
		})
	})
}

function AddCategory(category, categoryID, categoryDropdownID)
{
    $("#collapseNotes").append(
        `<button class="category btn btn-light btn-sm ml-4 p-0 text-left w-50" id ="${categoryID}" value="${category}" type="button" 
        data-toggle="collapse" data-target="#${categoryDropdownID}" aria-expanded="false" aria-controls="${categoryDropdownID}" name="category">
            ${category}
        </button>
        <div class="collapse" id="${categoryDropdownID}" value="${category}" ></div>`);
}

function AddSubCategory(subCategory, subCategoryID, categoryDropdownID, finalCategoryDropdownID){

    $(`#${categoryDropdownID}`).append(`
    <button class="subCategory btn btn-light btn-sm ml-5 p-0 mb-1 text-left w-50" id ="${subCategoryID}" value="${subCategory}" type="button" 
    data-toggle="collapse" data-target="#${finalCategoryDropdownID}" aria-expanded="false" aria-controls="${finalCategoryDropdownID}" name="subCategory">
        ${subCategory}
    </button>
    <div class="collapse" id="${finalCategoryDropdownID}" value="${subCategory}" ></div>`)
}

function AddFinalCategory(finalCategory, finalCategoryID, finalCategoryDropdownID){
    
    $(`#${finalCategoryDropdownID}`).append(
        `<button class="finalCategory btn btn-light btn-sm ml-5 p-0 text-left mb-1 w-50" id ="${finalCategoryID}" value="${finalCategory}" name="finalCategory">
            <div class="ml-2" >${finalCategory}</div>
        </button>`);
}

// For context menu
var i = document.getElementById("menu").style;
if (document.addEventListener) {
  document.addEventListener('click', function(e) {
    i.opacity = "0";
    setTimeout(function() {
      i.visibility = "hidden";
      RemoveEventListeners(); 
    }, 501);
  }, false);
} else {
  document.attachEvent('oncontextmenu', function(e) {
    var posX = e.clientX;
    var posY = e.clientY;
    menu(posX, posY);
    e.preventDefault();
  });
  document.attachEvent('onclick', function(e) {
    i.opacity = "0";
    setTimeout(function() {
      i.visibility = "hidden";
    }, 501);
  });
}

function menu(x, y) {
    i.top = y + "px";
    i.left = x + "px";
    i.visibility = "visible";
    i.opacity = "1";  
}

// End of context menu

function ConsoleLogHTML(){
    console.log($(`#${globalID}`));
}

function RemoveEventListeners()
{
     // These prevents multiple EL's being added to the elements
    $(`.reorderDown`).off();
    $(`.reorderUp`).off(); 
    $(`#btnEditContextMenu`).off();
    $(`#deleteCategory`).off();
    $(`.inspectElement`).off(); 
    $(`#btnAddNewCategory`).off();
}

// If you dont want to reopen position, just pass empty strings
function RefreshCategories()
{
    // Need to store these as loadcategories() will delete them
    let categoryType = globalCategoryType;
    let categoryID = globalCategoryID; 
    let subCategoryID = globalSubCategoryID;
    LoadCategoriesIntoSidebar(); 

    setTimeout(function () {
        ReOpenCategoryDropdowns(categoryType, categoryID, subCategoryID)
    }, 500);

    RefreshGlobals();
    RefreshIndexData();
}

function ReOpenCategoryDropdowns(categoryType, categoryID, subCategoryID)
{
    if(categoryType == "category")
    {
        $(`#collapseNotes`).click(); 
        
    }
    if(categoryType == "subCategory")
    {
        $(`#collapseNotes`).click(); 
        $(`#${categoryID}`).click();
    }

    if(categoryType == "finalCategory")
    {
        $(`#${categoryID}`).click();
        $(`#${subCategoryID}`).click();
    }
}
