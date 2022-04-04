 // Globals
var globalContentCategoryID;
var globalContentSubCategoryID;
var globalContentFinalCategoryID;

var globalContentID; 
var globalContentCategory;

function DisplayContentContextMenu(e)
{

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

    $(`#menu`).append(`<a href="#" id="btnAddParagraphSection"><img src="icons/icons8-edit-50.png" />Add Paragraph Section</a>`);
    $(`#menu`).append(`<a href="#" id="btnAddImageSection"><img src="icons/icons8-edit-50.png" />Add Image Section</a>`);
    $(`#menu`).append(`<a href="#" id="btnAddHeaderSection"><img src="icons/icons8-edit-50.png" />Add Header Section</a>`);
    $(`#menu`).append(`<a href="#" id="btnAddCodeSection"><img src="icons/icons8-edit-50.png" />Add Code Section</a>`);
    $(`#menu`).append(`<a href="#" id="btnAddLinkSection"><img src="icons/icons8-edit-50.png" />Add Link Section</a>`);

    if (!$(this).hasClass("pageTitle")) {

        $(`#menu`).append(`<a href="#" id="btnEditDiv"><img src="icons/icons8-edit-50.png" />Edit</a>`);
        $(`#menu`).append(`<a href="#" id="btnDeleteSection"><img src="icons/icons8-edit-50.png" />Delete section</a>`);
    }


    if($(this).hasClass( "sectionHeader" ))
    {
        globalContentCategory = "sectionHeader"; 
        globalContentID = this.id;
    }

    if($(this).hasClass( "paragraph" ))
    {
        globalContentCategory = "paragraph"; 
        globalContentID = this.id; 
        
    } else if($(this).hasClass("pageTitle"))
    {
        globalContentID = this.id; 
        globalContentCategory = "pageTitle"; 
    }

    // Add event listeners
    $(`#btnEditDiv`).click(EditContent);
    $(`#btnAddHeaderSection`).click(AddHeader);
    $(`#btnAddParagraphSection`).click(AddParagraphInputSection);
    $(`#btnDeleteSection`).click(DeleteSection); 
    
}

function AddParagraphInputSection()
{
    // globalContentCategory will be "paragraph", globalDivID is the current div

    // If it's a header, it needs to add the new paragraph below the next div
    if(globalContentCategory == "sectionHeader" )
    {
        globalContentID = $(`#${globalContentID}`).next().attr("id"); 
        globalContentCategory = "paragraph"; 
    }

    // Add paragraph div to html below the current div
    $(`#${globalContentID}`).after(`<textarea class="paragraphSection form-control p-0 mb-1" id="new${globalContentCategory}Header123" rows="1" style="width: 50%;">Add paragraph title here</textarea>`);
    $(`#new${globalContentCategory}Header123`).after(`<textarea class="paragraphSection form-control p-0 mb-1" id="new${globalContentCategory}" rows="10" style="min-width: 100px;">Add paragraph text here</textarea>`);

    // Add submit and cancel buttons
    $(`#new${globalContentCategory}`).after(`
        <button class="btn btn-primary btn-sm mb-2" id="submitNewSection">Add</button>
        <button class="btn btn-primary btn-sm mb-2" id="cancelAddingSection">Cancel</button>`);

    // Add event listeners
    $(`#submitNewSection`).click(AddContent); 
    $(`#cancelAddingSection`).click(CancelAddDiv); 
    
}

async function AddContent()
{
    let previousHeader = $(`#${globalContentID}`).prev().html(); 
    
    // Get the title to be used as a key for the new paragraph
    let header = $(`#new${globalContentCategory}Header123`).val(); 

    if(header.length < 2 || header == undefined)
    {
        console.log("Header not set")
        return; 
    }

    // Get the text input
    let newText = $(`#new${globalContentCategory}`).val();

    // Set the globals so they can be used after ReconstructJson
    let categoryID = globalCategoryID; 
    let subCategoryID = globalSubCategoryID;
    let finalCategoryID = globalFinalCategoryID;

    
    // Add the text to json. AddNewContentToJson takes in the new content key name, the new text, the finalCategoryID and the id of the content position before the new content
    await AddNewContentToJson(header, newText, globalFinalCategoryID, globalContentID, previousHeader).then(function(e){

        if (e == "BADHEADER")
        {
            return; 
        }
        // reload the page 
        RefreshIndexData();

        // Set the globals for displayPage/ notesCategories to work
        globalCategoryID = categoryID;
        globalSubCategoryID = subCategoryID;
        globalFinalCategoryID = finalCategoryID;

        // Click to open the page again and open up the categories tabs
        setTimeout(function () {
            ReOpenCategoryDropdowns("finalCategory", categoryID, subCategoryID); 
            $(`#${finalCategoryID}`).click(); 
        }, 500);
         
    })
}

function AddHeader()
{
    let section = "Header"; 
    AddDataHTML(`<div><h5 class="text-left ml-3" style="float:left;" contenteditable = "true" id="${globalFinalCategoryID}${section}${num}">${response[i]}</h5></div>`);
}

function CancelAddDiv()
{
    $(`#new${globalContentCategory}Header123`).remove();
    $(`#new${globalContentCategory}`).remove();
    $(`#submitNewSection`).remove();
    $(`#cancelAddingSection`).remove();
    
}

function EditContent()
{
    if(globalContentCategory == "paragraph" || globalContentCategory == "sectionHeader")
    { 
        
        // Replace info box with text editor
        let currentText = $(`#${globalContentID}`).html(); 

        let numOfLines = currentText.length / 30 ; 

        $(`#${globalContentID}`).html(`
        <textarea class="form-control p-0 mb-1" id="newEditContent" rows="${numOfLines}" style="min-width: 100px;">${currentText}</textarea>`);

        $(`#${globalContentID}`).after(`
        <button class="btn btn-primary btn-sm mb-2" id="submitNewInfoText">Confirm edit</button>
        <button class="reloadBtn btn btn-primary btn-sm mb-2" id="cancelEdittingInfoText">Cancel Edit</button>`);

        // Add event listeners
        $(`#cancelEdittingInfoText`).click(function(){
            CancelEditSection(currentText);
        })

        // Add event listeners
        $(`#submitNewInfoText`).click(SubmitEditSection);

    }

}

async function SubmitEditSection()
{
    // if header then get the key by removing the "Header"
    let originalHeader; 
    if(globalContentCategory == "sectionHeader")
    {
        originalHeader = $(`#${globalContentID}`).attr("id");
        originalHeader = originalHeader.substring(0, originalHeader.indexOf("Header123")); 

        if(originalHeader.length < 2 || originalHeader == undefined)
        {
            alert("Header not set or less than 2 characters in length")
            return; 
        }
    }
    else{
        originalHeader = $(`#${globalContentID}`).prev().attr("id");
        originalHeader = originalHeader.substring(0, originalHeader.indexOf("Header123"))
    }

    let newText = $(`#newEditContent`).val(); 

    // Set the globals so they can be used after ReconstructJson
    let categoryID = globalCategoryID; 
    let subCategoryID = globalSubCategoryID;
    let finalCategoryID = globalFinalCategoryID;

    await EditContentInJson(newText, originalHeader).then(function(e){

        if (e == "BADHEADER")
        {
            return; 
        }

        // reload the page 
        RefreshIndexData();

        // Set the globals for displayPage/ notesCategories to work
        globalCategoryID = categoryID;
        globalSubCategoryID = subCategoryID;
        globalFinalCategoryID = finalCategoryID;

        // Click to open the page again and open up the categories tabs
        setTimeout(function () {
            ReOpenCategoryDropdowns("finalCategory", categoryID, subCategoryID); 
            $(`#${finalCategoryID}`).click(); 
        }, 500);

    });
}

function CancelEditSection(currentText)
{
    $(`#${globalContentID}`).html(currentText);
    $(`#${globalContentID}`).attr(`contenteditable`, false); 

    $(`#cancelEdittingInfoText`).remove(); 
    $(`#submitNewInfoText`).remove(); 
}

function ResetEditContentGlobals()
{
    globalContentCategory = ""; 
    globalContentCategoryID = "";
    globalContentSubCategoryID = "";
    globalContentFinalCategoryID = "";
    globalContentID = ""; 
}

async function DeleteSection()
{
    let key; 
    if(globalContentCategory == "sectionHeader")
    {
        key = $(`#${globalContentID}`).attr("id");
        key = key.substring(0, key.indexOf("Header123"));
    }
    else{
        key = $(`#${globalContentID}`).prev().attr("id");
        key = key.substring(0, key.indexOf("Header123"))
    }

    console.log(key)

    // Set the globals so they can be used after ReconstructJson
    let categoryID = globalCategoryID; 
    let subCategoryID = globalSubCategoryID;
    let finalCategoryID = globalFinalCategoryID;

    // Needs the section key to delete
    await DeleteContentFromJson(key).then(function(){

        // reload the page 
        RefreshIndexData();

        // Set the globals for displayPage/ notesCategories to work
        globalCategoryID = categoryID;
        globalSubCategoryID = subCategoryID;
        globalFinalCategoryID = finalCategoryID;

        // Click to open the page again and open up the categories tabs
        setTimeout(function () {
            ReOpenCategoryDropdowns("finalCategory", categoryID, subCategoryID); 
            $(`#${finalCategoryID}`).click(); 
        }, 500);
    })

}