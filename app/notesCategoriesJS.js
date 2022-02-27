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
                let subCategoryDropdownID = `finalCats${subCategoryID}`; 

                AddSubCategory(subCategory, subCategoryID, categoryDropdownID, subCategoryDropdownID); 

                // Add entry to globalMap
                globalSubCategoryMap[subCategoryID] = {
                    categoryName: subCategory,
                    categoryType : "subCategory",
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
        $(`.category`).contextmenu(DisplayContextMenu); 

        $(`.subCategory`).contextmenu(DisplayContextMenu); 

        $(`.finalCategory`).click(DisplayCategoryPage); 

        $(`.finalCategory`).contextmenu(DisplayContextMenu); 

    })

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

}

function DisplayContextMenu(e){

    // Set position of menu to mouse click
    var posX = e.clientX;
    var posY = e.clientY;
    menu(posX, posY);
    e.preventDefault();

    // Get the details from the globalMap
    let current = globalCategoryMap[this.id];
    if(current == undefined){
        current = globalSubCategoryMap[this.id];
    }
    if(current == undefined){
        current = globalFinalCategoryMap[this.id];
    }

    // Set global type for future reference
    globalID = this.id; 
    globalCategoryType = current.categoryType

    if(current.categoryType == "category")
    {
        // Set globals
        globalCategoryID = this.id;

        // Show add subcategory option
        
        

    } else if (current.categoryType == "subCategory")
    {
        // Set globals
        globalCategoryID = current.parentCategoryID;
        globalSubCategoryID = this.id; 

        // Show options needed 
        $("#addFinalCategoryBox").attr(`style`,"visibility:visible;");

        // Add labels to context menu
        $(`#addFinalCategory`).html(`Add new category to "${this.value}"`); 
        
    } else if(current.categoryType == "finalCategory")
    {
        // Set globals
        globalCategoryID = current.parentParentCategoryID;
        globalSubCategoryID = current.parentCategoryID;
        globalFinalCategoryID = this.id;
        
    }; 

    // Add labels to context menu
    $(`#editCategory`).html(`Edit category name "${this.value}"`); 
    $(`#deleteCategory`).html(`Delete category "${this.value}"`); 
   
    // Reorder button? Gives the current button number that you can then change

    // Add event listener to edit button
    $(`#btnEditContextMenu`).click(EnableEditCategoryName); 

    // Add event listender to delete button
    // TO DO

    // Add event listener to inspect button
    $(`.inspectElement`).click(ConsoleLogHTML); 

    // Add event listener to reorder button
    $(`.reorderDown`).click(function(){
        ReorderCategoriesDown();
        e.stopPropagation()
    }); 
    $(`.reorderUp`).click(ReorderCategoriesUp); 


    globalCategoryNumberCheck = Object.keys(globalCategoryMap).length + Object.keys(globalSubCategoryMap).length + Object.keys(globalFinalCategoryMap).length;

}

function ReorderCategoriesDown()
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
              // code block
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

function ReorderCategoriesUp()
{

    console.log(globalCategoryType);
    let type;
    switch(globalCategoryType) {
        case "category":
            type = globalCategoryMap; 
            break;
        case "subCategory":
            type = globalSubCategoryMap; 
            break;
        case "finalCategory":
            type = globalFinalCategoryMap; 
            break;
        default:
              // code block
    }

    // decrement current number category 
    l

    // increment new number category
    type.numbering -= 1;

    // Recreate json file
    //ReconstructJson();
    
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

        CancelEdit(); 

        // This prevents the event from bubbling, so that the parent button will not activate and therefore the page will not display when clicking
        e.stopPropagation();
    })

}

async function CancelEdit(){

    // Refresh categories
    await LoadCategoriesIntoSidebar().then(function(){
        
        OpenPreviousCategoryLocation(globalCategoryType, globalCategoryID, globalSubCategoryID); 
    }); 
    
}

function OpenPreviousCategoryLocation(type, catID, subCatID)
{
    // Open  previous location
    if(type=="finalCategory"){
        $(`#${catID}`).click();
        $(`#${subCatID}`).click();
    }
    else if (type=="subCategory"){
        $(`#${catID}`).click();
    }
}

// Gets the category names and uses function from displayPageJS.js
function DisplayCategoryPage(){

    let finalCat = this.value;
    let subCat = this.parentElement.getAttribute("value");
    let cat = this.parentElement.parentElement.getAttribute("value");
    DisplayContent(cat, subCat, finalCat); 

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

// Removes all spaces and symbols from a string
function RemoveSpaces(str){
    return str.replace(/[^a-zA-Z]/g, ""); 
}

// For context menu
var i = document.getElementById("menu").style;
if (document.addEventListener) {
  document.addEventListener('click', function(e) {
    i.opacity = "0";
    setTimeout(function() {
      i.visibility = "hidden";
      $(`.reorderDown`).off(); // This prevents multiple EL's being added to this id
      $(`.reorderUp`).off(); // This prevents multiple EL's being added to this id
      $(`#btnEditContextMenu`).off(); // This prevents multiple EL's being added to this id
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
      $(`.reorderDown`).off(); // This prevents multiple EL's being added to this id
      $(`.reorderUp`).off(); // This prevents multiple EL's being added to this id
      $(`#btnEditContextMenu`).off(); // This prevents multiple EL's being added to this id
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