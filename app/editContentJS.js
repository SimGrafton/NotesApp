var debug = false;

var globalContentID; 
var globalContentCategory;
var globalPreviousKey; // Needed so that can reconstruct the json object in order when adding content

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

    if($(this).hasClass( "paragraphContent" ))
    {
        globalContentCategory = "paragraphContent"; 
        globalContentID = this.id; 
        
    } else if($(this).hasClass("pageTitle"))
    {
        globalContentID = this.id; 
        globalContentCategory = "pageTitle"; 

    } else if ($(this).hasClass("headerContent"))
    {
        globalContentID = this.id; 
        globalContentCategory = "headerContent"; 
    } else if ($(this).hasClass("codeContent"))
    {
        globalContentID = this.id; 
        globalContentCategory = "codeContent"; 
    } else if ($(this).hasClass("imgContent"))
    {
        globalContentID = this.id; 
        globalContentCategory = "imgContent"; 
    }
    else if ($(this).hasClass("linkContent"))
    {
        globalContentID = this.id; 
        globalContentCategory = "linkContent"; 
    }

    if(debug)
    {
        let arr = {
            function: `DisplayContentContextMenu()`,
            globalContentID: `${globalContentID}`,
            globalContentCategory: `${globalContentCategory}`
        }
        console.log("START OF EDITCONTENT PROCESS")
        console.log(arr)
    }

    // Add event listeners
    $(`#btnEditDiv`).click(EditContent);
    $(`#btnAddHeaderSection`).click(function(){
        AddContentInputSection("headerContent");
    }); 
    $(`#btnAddParagraphSection`).click(function(){
        AddContentInputSection("paragraphContent");
    }); 
    $(`#btnAddCodeSection`).click(function(){
        AddContentInputSection("codeContent");
    }); 
    $(`#btnAddImageSection`).click(function(){
        AddContentInputSection("imgContent");
    }); 
    $(`#btnAddLinkSection`).click(function(){
        AddContentInputSection("linkContent");
    }); 
    $(`#btnDeleteSection`).click(DeleteSection); 
    
}

function AddContentInputSection(contentCategory)
{

    // Set the key as the page title header
    let ID = globalContentID; 
    let previousKey = globalKeyFromIDMap[$(`#${ID}`).attr("id")]; 

    if(!previousKey)
    {
        previousKey = ID; 
    }
    
    // Add content below the current content - First add the header for the content, then add the content
    $(`#${ID}`).after(GetNewContentInputHTML(contentCategory, "content"));    
    
    // Add submit and cancel buttons
    $(`#newContent`).after(`
        <button class="btn btn-primary btn-sm mb-2" id="submitNewSection">Add</button>
        <button class="btn btn-primary btn-sm mb-2" id="cancelAddingSection">Cancel</button>`);

    // Add event listeners to either cancel or submit the data
    $(`#cancelAddingSection`).click(CancelAddContent); 

    EnableTabs("newContent"); // This makes it so tabs make indent rather than tabbing to next item. 

    $(`#submitNewSection`).click(function () {

        // Get the entered content
        let newContent = $(`#newContent`).val(); 

        // Verify the content entered
        if(newContent.length < 2 || newContent == undefined)
        {
            console.log("Content needs to be greater than 2 characters")
            return; 
        }

        // Create a key of length 10
        let newContentKey = MakeID(10, newContent); 

        // Add a prefix if necessary so that content type can be identified e.g with 11HEAD11 for a header
        newContentKey = SetNewContentPrefix(contentCategory, newContentKey);

        if(debug)
        {
            let arr = {
                function: `AddContentInputSection()`,
                newContentKey: `${newContentKey}`,
                newContent: `${newContent}`,
                previousKey: `${previousKey}`
            }
            console.log(arr)
        }

        AmendJsonAddContentAndRefreshPage(newContentKey, newContent, previousKey)
    }); 
    
}

// This is where the new data entry box html is set. So define how you want the input box to look here
function GetNewContentInputHTML(contentCategory, headerOrContent)
{
    if(headerOrContent == "contentKey")
    {
        return `<textarea class="${contentCategory} form-control p-0 mb-1" id="newContentKey" rows="1" style="width: 50%;">Enter label</textarea>`; 
    }

    if(headerOrContent == "content")
    {
        // html for a new paragraph entry box
        if (contentCategory == "paragraphContent")
        {
            return `<textarea class="form-control p-0 mb-1" id="newContent" rows="10" style="min-width: 100px;" placeholder="Enter Content"></textarea>`;
        }

        if (contentCategory == "headerContent")
        {
            return `<textarea class="form-control p-0 mb-1" id="newContent" rows="10" style="min-width: 100px;" placeholder="Enter Header"></textarea>`; 
        }

        if (contentCategory == "codeContent")
        {
            return `<textarea class="form-control p-0 mb-1" id="newContent" rows="10" style="min-width: 100px;" placeholder="Enter Code"></textarea>`;
        }

        if (contentCategory == "imgContent")
        {
            return `<textarea class="form-control p-0 mb-1" id="newContent" rows="1" style="min-width: 100px;" placeholder="Enter image filename with filetype. File must 
            be in data/images file (e.g "fileName.jpg")"></textarea>`;
        }

        if (contentCategory == "linkContent")
        {
            return `<textarea class="form-control p-0 mb-1" id="newContent" rows="1" style="min-width: 100px placeholder="Enter link address"></textarea>`;
        }
    }

}

function SetNewContentPrefix(contentCategory, header)
{
    let setHeader = RemoveSpaces(header);

    if(contentCategory == "codeContent")
    {
        return `11CODE11${setHeader}`; 
    }

    if(contentCategory == "imgContent")
    {
        return `11IMG11${setHeader}`; 
    }

    if(contentCategory == "headerContent")
    {
        return `11HEAD11${setHeader}`; 
    }

    if(contentCategory == "linkContent")
    {
        return `11LINK11${setHeader}`; 
    }

    else 
    {
        return setHeader; 
    }
}

async function AmendJsonAddContentAndRefreshPage(newContentKey, newText, previousKey)
{

    // Set the globals so they can be used after ReconstructJson
    let categoryID = globalCategoryID; 
    let subCategoryID = globalSubCategoryID;
    let finalCategoryID = globalFinalCategoryID;

    if (debug) {
        let arr = {
            function: `AddNewContentToJson()`,
            newContentKey: `${newContentKey}`,
            newText: `${newText}`,
            previousKey: `${previousKey}`,
            finalCategoryID: `${finalCategoryID}`,
        }
        console.log(arr)
    }

    // Add the text to json. AddNewContentToJson takes in the new content key name, the new text, the finalCategoryID and the id of the content position before the new content
    await AddNewContentToJson(newContentKey, newText, previousKey).then(function(e){

        if (e == "BADHEADER")
        {
            console.log("bad header")
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

function CancelAddContent()
{
    
    $(`#newContent`).remove();
    $(`#submitNewSection`).remove();
    $(`#cancelAddingSection`).remove();
    
}

function EditContent()
{


    // Replace info box with text editor
    let currentText = $(`#${globalContentID}`).html();

    let numOfLines = (currentText.length / 30) + 5;

    $(`#${globalContentID}`).html(`
        <textarea class="form-control p-0 mb-1" id="newEditContent" rows="${numOfLines}" style="min-width: 100px;">${currentText}</textarea>`);

    EnableTabs("newEditContent"); // This makes it so tabs make indent rather than tabbing to next item. 

    $(`#${globalContentID}`).after(`
        <button class="btn btn-primary btn-sm mb-2" id="submitNewInfoText">Confirm edit</button>
        <button class="reloadBtn btn btn-primary btn-sm mb-2" id="cancelEdittingInfoText">Cancel Edit</button>`);

    // Add event listeners
    $(`#cancelEdittingInfoText`).click(function () {
        CancelEditSection(currentText);
    })

    // Add event listeners
    $(`#submitNewInfoText`).click(SubmitEditSection);

}

async function SubmitEditSection()
{
    // Get the key
    let ID = globalContentID; 
    let key = globalKeyFromIDMap[$(`#${ID}`).attr("id")]; 

    if(!key)
    {
        key = ID; 
    }

    let newText = $(`#newEditContent`).val(); 

    // Validate new entry
    if(newText.length < 2 || newText == undefined)
    {
        console.log("New content is too short")
        return; 
    }

    // Set the globals so they can be used after ReconstructJson
    let categoryID = globalCategoryID; 
    let subCategoryID = globalSubCategoryID;
    let finalCategoryID = globalFinalCategoryID;

    if(debug)
    {
        let arr = {
            Function: `SubmitEditSection()`,
            key: `${key}`,
            newText: `${newText}`            
        }
        console.log(arr)
    }

    await EditContentInJson(newText, key).then(function(e){

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

async function DeleteSection()
{
    // Get the key for the json object
    let key = globalKeyFromIDMap[$(`#${globalContentID}`).attr("id")];

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

function EnableTabs(id){

    $(`#${id}`).keydown( function(e) {
        if (e.key == 'Tab') {
          e.preventDefault();
          var start = this.selectionStart;
          var end = this.selectionEnd;
      
          // set textarea value to: text before caret + tab + text after caret
          this.value = this.value.substring(0, start) +
            "    " + this.value.substring(end);
      
          // put caret at right position again
          this.selectionStart =
            this.selectionEnd = start + 4;
        }
      });
}