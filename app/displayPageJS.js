// Globals
var globalKeyFromIDMap = {}; // Added to in DisplayContent() as it's difficult to store the key name in the html as there could be spaces or numbers

async function DisplayContent(category, subCategory, finalCategory){

    // Reset so that when page is displayed there is fresh entries
    globalKeyFromID = {};
    
    RefreshIndexData();

    let response = globalParsedNotes[category][subCategory][finalCategory];

    AddDataHTML(`<h5 class="d-flex ps-3 pt-3 text-muted">${category}</h5>`);
    AddDataHTML(`<h5 class="d-flex ps-4 pt-1 text-muted">${subCategory}</h5>`);
    // Add Title + Edit Name + Delete + Add new category
    AddDataHTML(`<h1 class="pageTitle hasContextMenu d-flex justify-content-center font-weight-bold" id="${globalFinalCategoryID}Title123" style="font-family: 'Times New Roman'">${finalCategory}</h1>`);

    UpdateSettingsFile("currentCategory", category);
    UpdateSettingsFile("currentSubCategory", subCategory);
    UpdateSettingsFile("currentFinalCategory", finalCategory);

    num = 0;
    for (let i in response) {
        let contentKey = Object.keys(response)[num];
        let sectionID = RemoveSpaces(contentKey);
        let contentHeaderID = `${sectionID}Header123`;
        let contentID;
        let contentClass; // Used for CSS
        let furtherClasses;
        let contentStyle;

        globalKeyFromIDMap[`${contentHeaderID}`] = contentKey; // Add header id to map

        if (contentKey.includes("11IMG11")) {
            contentID = `${sectionID}11IMG11${globalFinalCategoryID}`;
            contentClass = "imgContent p-1 ml-3 mb-3 align-self-center";

            ImageSizes(`${response[i]}`, contentID);

            AddDataHTML(`<img src="../data/images/${response[i]}" class="${contentClass} hasContextMenu d-flex" 
                    alt="${response[i]}" id="${contentID}" style="${contentStyle}"></img>`);

        }
        else if (contentKey.includes("11HEAD11")) {
            contentID = `${sectionID}11HEAD11${globalFinalCategoryID}`;
            contentClass = "headerContent";

            AddDataHTML(`<h5 class="${contentClass} hasContextMenu d-flex pl-1 ml-3 font-weight-bold justify-content-left" 
                                id="${contentID}">${response[i]}</h5>`);

        } else if (contentKey.includes("11LINK11")) {
            contentID = `${sectionID}11LINK11${globalFinalCategoryID}`;
            contentClass = "linkContent link-primary";

            AddDataHTML(`<a class="${contentClass} hasContextMenu d-flex p-1 ml-3 mb-3 font-weight-bold justify-content-center" 
                                id="${contentID}">${response[i]}</a>`);

        } else if (contentKey.includes("11CODE11")) // Not doing "code" as well as will move the code
        {
            contentID = `${sectionID}11CODE11${globalFinalCategoryID}`;
            contentClass = "codeContent";
            // going to use highlight.js for this
            contentStyle = `white-space: pre-wrap;`; // Whitespace prewrap enables the /t and /n for tabs and newlines

            AddDataHTML(`<code class="${contentClass} hasContextMenu d-flex p-1 ml-3 mb-3 justify-content-center" id="${contentID}" style="${contentStyle}">${response[i]}</code>`);

        } else // otherwise jsut display as text
        {
            contentID = `${sectionID}11PARA11${globalFinalCategoryID}`;
            contentClass = "paragraphContent";
            contentStyle = `white-space: pre-wrap;`;

            AddDataHTML(`<div class="${contentClass} hasContextMenu d-flex p-1 ml-3 mb-3" id="${contentID}" style="${contentStyle}">${response[i]}</div>`);
        }



        globalKeyFromIDMap[contentID] = contentKey;


        num++;
    }

    // text context menu event listener
    $(`.hasContextMenu`).contextmenu(DisplayContentContextMenu);


}

function ImageSizes(source, id)
{
    var img = new Image();
    img.onload = function() {
        //  alert(this.width + 'x' + this.height);
        $(`#${id}`).attr(`style`, `width: ${this.width}px; height: ${this.height}px;`); 
    }
    img.src = `../data/images/${source}`;
}