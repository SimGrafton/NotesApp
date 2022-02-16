async function DisplayContent(category, subCategory, FinalCategory){

    // Open file
    await GetContentFromFile(category, subCategory, FinalCategory).then(function(response){

        RefreshIndexData();

        AddDataHTML(`<h3 class="d-flex justify-content-center font-weight-bold p-5">${category } > ${subCategory} > ${FinalCategory}</h3>`);


        AddDataHTML(`<h5 class="text-left ml-3">Info:</h5>`);

        // Add edit button
        AddDataHTML(``)

        AddDataHTML(`<div class="d-flex justify-content-center p-1 ml-3 mb-5">${response["Info"]}</div>`);
        AddDataHTML(`<h5 class="text-left ml-3">Code:</h5>`);
        AddDataHTML(`<div class="d-flex justify-content-center p-1 ml-3">${response["Code"]}</div>`);

        //<div class="d-flex justify-content-center p-1">${html}</div>

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