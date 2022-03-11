// Globals

var globalDivCategory;

var globalContentCategoryID;
var globalContentSubCategoryID;
var globalContentFinalCategoryID;

var globalDivID; 

function DisplayContentContextMenu(e)
{
    // Set position of menu to mouse click
    var posX = e.clientX;
    var posY = e.clientY;
    $(`#menu`).html(""); // refresh the context menu
    menu(posX, posY);
    e.preventDefault();

    $(`#menu`).append(`<a href="#" id="btnEditDiv"><img src="icons/icons8-edit-50.png" />Edit</a>`);
    $(`#menu`).append(`<a href="#" id="btnAddParagraphSection"><img src="icons/icons8-edit-50.png" />Add Paragraph Section</a>`);
    $(`#menu`).append(`<a href="#" id="btnAddImageSection"><img src="icons/icons8-edit-50.png" />Add Image Section</a>`);
    $(`#menu`).append(`<a href="#" id="btnAddHeaderSection"><img src="icons/icons8-edit-50.png" />Add Header Section</a>`);
    $(`#menu`).append(`<a href="#" id="btnAddCodeSection"><img src="icons/icons8-edit-50.png" />Add Code Section</a>`);
    $(`#menu`).append(`<a href="#" id="btnAddLinkSection"><img src="icons/icons8-edit-50.png" />Add Link Section</a>`);
    $(`#menu`).append(`<a href="#" id="btnDeleteSection"><img src="icons/icons8-edit-50.png" />Delete section</a>`);


    // Set globals from finalCategoryID

    if($(this).hasClass( "infoBox" ))
    {
        globalContentFinalCategoryID = this.id.substring(0, this.id.indexOf(`Info`));
    }
    
    globalContentSubCategoryID = globalFinalCategoryMap[globalContentFinalCategoryID].parentCategoryID; 
    globalContentCategoryID = globalFinalCategoryMap[globalContentFinalCategoryID].parentParentCategoryID; 

    globalDivCategory = "Info"; 
    globalDivID = this.id; 

    // Add event listeners
    $(`#btnEditDiv`).click(EditDiv); 
    $(`#btnAddHeaderSection`).click(AddHeader); 
    $(`#btnAddParagraphSection`).click(AddParagraph); 

}

function AddParagraph()
{
    let section = "Paragraph";

    globalDivCategory = section; 

    // Add paragraph div to html below the current div
    // globalDivID is the current div
    $(`#${globalDivID}`).after(`<textarea class="paragraphSection form-control p-0 mb-1" id="new${section}" rows="10" style="min-width: 100px;">Add new text here</textarea>`);

    // Add submit and cancel buttons
    $(`#new${section}`).after(`
        <button class="btn btn-primary btn-sm mb-2" id="submitNewSection">Add</button>
        <button class="btn btn-primary btn-sm mb-2" id="cancelAddingSection">Cancel</button>`);

    // Add event listeners
    $(`#submitNewSection`).click(AddDiv); 
    $(`#cancelAddingSection`).click(CancelAddDiv); 
    
}

async function AddDiv()
{
    // Get the text in the box and set it in place
    let newText = $(`#new${globalCategoryDiv}`).html(); 
    //$(`#new${globalCategoryDiv}`).html(`<div class="paragraphSection d-flex justify-content-center p-1 ml-3 mb-5" id="new${globalCategoryDiv}">${newText}</div>`);

    // Add the text to json
    await AddNewDivToJson(newText).then(function(){
        // reload the page 
        // Set the globals for displayPage/ notesCategories to work
        globalCategoryID = globalContentCategoryID;
        globalSubCategoryID = globalSubContentCategoryID;
        globalFinalCategoryID = globalFinalContentCategoryID;

        DisplayCategoryPage();  
    })
}

function AddHeader()
{
    let section = "Header"; 
    AddDataHTML(`<div><h5 class="text-left ml-3" style="float:left;" contenteditable = "true" id="${globalFinalCategoryID}${section}${num}">${response[i]}</h5></div>`);
}

function CancelAddDiv()
{
    $(`#new${globalDivCategory}`).remove();
    $(`#submitNewSection`).remove();
    $(`#cancelAddingSection`).remove();
}

function EditDiv()
{
   
    if(globalDivCategory == "Info")
    {
        
        // Replace info box with text editor
        let currentText = $(`#${globalDivID}`).html(); 

        let numOfLines = currentText.length / 30 ; 

        $(`#${globalDivID}`).html(`
        <textarea class="form-control p-0 mb-1" id="NewCategoryName" rows="${numOfLines}" style="min-width: 100px;">${currentText}</textarea>`);

        $(`#${globalDivID}`).after(`
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

function SubmitEditSection()
{
    let newText = $(`#${globalDivID}`).html(); 

    EditContent(newText);

    $(`#${globalDivID}`).html(newText);
    $(`#${globalDivID}`).attr(`contenteditable`, false); 
    $(`#cancelEdittingInfoText`).remove(); 
    $(`#submitNewInfoText`).remove(); 
}

function CancelEditSection(currentText)
{
    $(`#${globalDivID}`).html(currentText);
    $(`#${globalDivID}`).attr(`contenteditable`, false); 

    $(`#cancelEdittingInfoText`).remove(); 
    $(`#submitNewInfoText`).remove(); 
}

function ResetEditContentGlobals()
{
    globalDivCategory = ""; 
    globalContentCategoryID = "";
    globalContentSubCategoryID = "";
    globalContentFinalCategoryID = "";
    globalDivID = ""; 
}