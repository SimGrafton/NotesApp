async function DisplayContent(category, subCategory, FinalCategory){

    // Open file
    await GetContentFromFile(category, subCategory, FinalCategory).then(function(response){

        RefreshIndexData();

        // Add Title + Edit Name + Delete + Add new category
        AddDataHTML(`<h3 class="d-flex justify-content-center font-weight-bold p-5">${category} > ${subCategory} > ${FinalCategory}</h3>`);


        // TODO
        // This will need to change to add an ID for each number down the list, so the first info will be info0, then might be a header1, info2, picture3 etc..
        // Or possibly could have one class of info and another of the number? Or id is the number etc..
        // Then needs to add them to the div in order they are in file. 

        let num = 0;
        for(let i in response)
        {
            let section = Object.keys(response)[num]; 

            AddDataHTML(`<div><h5 class="text-left ml-3" style="float:left;">${section}</h5></div>`);

            if(section == "Info")
            {
                AddDataHTML(`<div class="infoBox d-flex justify-content-center p-1 ml-3 mb-5" id="${globalFinalCategoryID}${section}${num}">${response[i]}</div>`);
            }

            if(section == "Code")
            {
                AddDataHTML(`<div class="codeBox d-flex justify-content-center p-1 ml-3 mb-5" id="${globalFinalCategoryID}${section}${num}">${response[i]}</div>`);
            }

            if(section == "Header")
            {
                AddDataHTML(`<div><h5 class="text-left ml-3" style="float:left;" id="${globalFinalCategoryID}${section}${num}">${response[i]}</h5></div>`);
            }


            num += 1; 
        }

        //<div class="d-flex justify-content-center p-1">${html}</div>

        // text context menu event listener
        $(`.infoBox`).contextmenu(DisplayContentContextMenu); 

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
