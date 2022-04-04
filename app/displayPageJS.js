async function DisplayContent(category, subCategory, finalCategory){

    // Open file
    await GetContentFromFile(category, subCategory, finalCategory).then(function(response){

        RefreshIndexData();

        // Add Title + Edit Name + Delete + Add new category
        AddDataHTML(`<h3 class="pageTitle hasContentContext d-flex justify-content-center font-weight-bold p-5" id="${globalFinalCategoryID}Title">${category} > ${subCategory} > ${finalCategory}</h3>`);

        // TODO
        // Each section needs a unqique category name to be used as an identifier. Need to remove invalid characters and check no duplicates

        let num = 0;
        for(let i in response)
        {
            let section = Object.keys(response)[num]; 

            AddDataHTML(`<h5 class="sectionHeader hasContentContext text-left ml-3" style="float:left;" id ="${section}Header123">${section}</h5>`);

            if(section.includes("11img11"))
            {
                AddDataHTML(`<div class="img hasContentContext d-flex justify-content-center p-1 ml-3 mb-5" id="${globalFinalCategoryID}${section}${num}">${response[i]}</div>`);
            }
            else if(section.includes("11Header11"))
            {
                AddDataHTML(`<h5 class="header hasContentContext text-left ml-3" style="float:left;" id="${globalFinalCategoryID}${section}${num}">${response[i]}</h5>`);
            } else
            {
                AddDataHTML(`<p class="paragraph hasContentContext text-left ml-3" style="float:left;" id="${globalFinalCategoryID}${section}${num}">${response[i]}</p>`);
            }

            num += 1; 
        }

        //<div class="d-flex justify-content-center p-1">${html}</div>

        // text context menu event listener
        $(`.hasContentContext`).contextmenu(DisplayContentContextMenu);

    });
}

async function GetContentFromFile(category, subCategory, FinalCategory)
{
    return new Promise(resolve => {

		fs.readFile("data/MyNotesJson.txt", 'utf8', function (err, notes) {
			if (err) {
				console.log("An error has occurred opening json storage file: " + err);
			}
			else {
			
                // Parse return data and return relevant section
                let parsedNotes = JSON.parse(notes); 

				resolve (parsedNotes[category][subCategory][FinalCategory]); 
			} 
		})
	})
}
