// Add all categories to sidebar menu

// `<a href="#" class="btnUpdate ml-3 text-dark small" style="text-decoration: none !important; display: block;">- To do</a>`
// `<a href="#" class="btnDelete ml-3 text-dark small" style="text-decoration: none !important; display: block;">- C++</a>`

LoadCategoriesIntoSidebar(); 

var parsedNotes;

async function LoadCategoriesIntoSidebar()
{
    await GetCategories().then(function(response){
        let catCount = 0;
        let subCatCount = 0;
        let finalCatCount = 0;

        for(let i in response)
        {   

            // Add a category to #collapseNotes which will be a button + a hidden list. The button will have an id which is the 
            // category name with spaces removed. The hidden list will have an ID of the "subCategoriesOf${categoryName}".
            // AddCategory(Category name, id for button reference, id of sub categories dropdown)
            AddCategory(i, `${RemoveSpaces(i)}${catCount}`, `subCategoriesOf${RemoveSpaces(i)}${catCount}`);

            // And subcategories
            for(let j in response[i]){

                // For every subcategory AddSubCategory(Subcategory name, id for button reference, id of parent dropdown, id of final categories dropdown)
                AddSubCategory(j, RemoveSpaces(j), `subCategoriesOf${RemoveSpaces(i)}${catCount}`, `finalCats${RemoveSpaces(j)}${subCatCount}`); // 

                for(let k in response[i][j]){
                    
                    //AddFinalCategory(final category name, id for button reference, id of parent dropdown)
                    AddFinalCategory(k, `${RemoveSpaces(k)}${finalCatCount}`, `finalCats${RemoveSpaces(j)}${subCatCount}`);

                    //Add event listener to finalcategories 
                    $(`#${RemoveSpaces(k)}${finalCatCount}`).click(DisplayCategoryPage); 

                    finalCatCount += 1;
                    
                }

                subCatCount += 1;
                
            }

            catCount += 1; 

        }
    })

}

function DisplayCategoryPage(){

    let finalCat = this.value;
    let subCat = this.parentElement.getAttribute("value");
    let cat = this.parentElement.parentElement.getAttribute("value");
    DisplayContent(cat, subCat, finalCat); 

}

async function GetCategories()
{
    return new Promise(resolve => {

		let categories = []; 

		fs.readFile("data/MyNotesJson.txt", 'utf8', function (err, notes) {
			if (err) {
				console.log("An error has occurred opening json storage file: " + err);
			}
			else {
				// Iterate through file names, remove .json and store in object

                // Parse return data and save to global variable
                parsedNotes = JSON.parse(notes); 

				resolve (parsedNotes); 
			} 
		})
	})
}

function AddCategory(category, id, subCatId)
{
    $("#collapseNotes").append(`<button class="btn btn-light btn-sm ml-4 p-0 text-left w-50" id ="${id}"  type="button" data-toggle="collapse" data-target="#${subCatId}" aria-expanded="false" aria-controls="${subCatId}">
                                     ${category}
                                </button>
                                <div class="collapse" id="${subCatId}" value="${category}">
                                </div>`);
}

function AddSubCategory(subCategory, id, subCatId, finalCatId){
    $(`#${subCatId}`).append(`<button class="btn btn-light btn-sm ml-5 p-0 mb-1 text-left w-50" id ="${id}"  type="button" data-toggle="collapse" data-target="#${finalCatId}" aria-expanded="false" aria-controls="${finalCatId}">
                                        ${subCategory}
                                    </button>
                                    <div class="collapse" id="${finalCatId}" value="${subCategory}">
                                    </div>`)
}

function AddFinalCategory(finalCategory, id, finalCatId){
    
    $(`#${finalCatId}`).append(`<button class="btn btn-light btn-sm ml-5 p-0 text-left mb-1 w-50" id ="${id}" value="${finalCategory}"><div class="ml-2">${finalCategory}</div></button>`);

    
}

// Removes all spaces and symbols from a string
function RemoveSpaces(str){
    return str.replace(/[^a-zA-Z]/g, ""); 
}