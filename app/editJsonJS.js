async function EditCategoryNameInJson(newCategoryName){

    if(globalCategoryType == "category")
    {
        globalCategoryMap[globalID].newCategoryName = newCategoryName;
    }
    else if(globalCategoryType == "subCategory")
    {
        globalSubCategoryMap[globalID].newCategoryName = newCategoryName;
    }
    else if(globalCategoryType == "finalCategory")
    {
        globalFinalCategoryMap[globalID].newCategoryName = newCategoryName;

    } else
    {
        return console.log("Unknown Category Type when Editing Json");
    }

    // Update the JSON file
    await UpdateJsonFile(parsedNotes).then(function(status){
        if(status){
            ReconstructJson("Edit Category");
        }
        else{
            console.log("Unknown Error in writing to json file"); 
            CancelEdit(); 
        }
    });
    
}

async function UpdateJsonFile(updatedJson){

    return new Promise(resolve => {

        let status = false; 

		fs.writeFile("data/MyNotesJson.txt", JSON.stringify(updatedJson), function (err) {
			if (err) {
                console.log("An error has occurred opening json storage file: " + err);
                
                resolve (status);
			}
			else {
                status = true; 
				resolve (status); 
			} 
		})
	})
}; 

async function ReconstructJson(action)
{
    let numberCheck = 0; 
    let newBuild = {};
    for (let i = 0; i < Object.keys(globalCategoryMap).length; i++) {
        // Get category name
        let category = FindCategoryByNumber(i, globalCategoryMap);
        newBuild[category[2]] = {};
        numberCheck += 1; 

        // Now get the subcategories in order
        let it = globalCategoryMap[category[1]]; 
        
        for (let j = 0; j < it.subCategoryIDs.length; j++) {
            // Get the subcategory with numbering j and with parentID as 
            let subCategory = FindSubCategoryByNumber(j, globalSubCategoryMap, category[1]);

            if(subCategory != undefined)
            {
                newBuild[category[2]][subCategory[2]] = {};
                numberCheck += 1; 
                // Now get the final categories in order
                // Need to get the number of finalcategories within the current subcategory. subcategoryIDs is within globalSubCategoryMap[], 
                // the current subcategoryid is subCategory[1]. So globalSubCategoryMap[subCategory1][subCategoryIDs].length
                let finalCategoriesWithinSubCategory = globalSubCategoryMap[subCategory[1]]; 
                
                for (let k = 0; k < finalCategoriesWithinSubCategory.subCategoryIDs.length; k++) {

                    let finalCategory = FindSubCategoryByNumber(k, globalFinalCategoryMap, subCategory[1]);

                    if(finalCategory != undefined)
                    {
                        newBuild[category[2]][subCategory[2]][finalCategory[2]] = parsedNotes[category[0]][subCategory[0]][finalCategory[0]];
                        numberCheck += 1; 
                    }
                    

                }

            }
            
        }

    }

    if(action != "delete")
    {
        if(numberCheck != globalCategoryNumberCheck){
            console.log(JSON.stringify(newBuild).length);
            console.log(JSON.stringify(parsedNotes).length);
            return alert(`Count of categories before move (${globalCategoryNumberCheck}) and after move (${numberCheck})are not equal, change has not been made`);
        }
        else{
            //Update the json
            await UpdateJsonFile(newBuild).then(function(){
    
                let type = globalCategoryType;
                let catID = globalCategoryID;
                let subCatID = globalSubCategoryID; 
    
                LoadCategoriesIntoSidebar();
                
                setTimeout(function()
                {
                    OpenPreviousCategoryLocation(type, catID, subCatID);
                }, 300);
    
            }); 
        }
    } else
    {
        await UpdateJsonFile(newBuild).then(function(){
    
            let type = globalCategoryType;
            let catID = globalCategoryID;
            let subCatID = globalSubCategoryID; 

            LoadCategoriesIntoSidebar();
            
            setTimeout(function()
            {
                OpenPreviousCategoryLocation(type, catID, subCatID);
            }, 300);

        }); 
    }
    
    
}

function FindCategoryByNumber(num, global)
{
    for (let i in global)
    {
        if(global[i].numbering == num)
        {
            if(global[i].newCategoryName != undefined)
            {
                return [global[i].categoryName, i, global[i].newCategoryName]; 
            }
            else{
                return [global[i].categoryName, i, global[i].categoryName]; 
            }
        }
    }
}

function FindSubCategoryByNumber(num, global, parent)
{
    for (let i in global)
    {
        // needs to check the parentCategory too
        if(global[i].numbering == num && global[i].parentCategoryID == parent)
        {

            if(global[i].newCategoryName != undefined)
            {
                return [global[i].categoryName, i, global[i].newCategoryName]; 
            }
            else{
                return [global[i].categoryName, i, global[i].categoryName]; 
            }
            
        }
    }
}

function DeleteCategoryFromJson()
{
    if(globalCategoryType == "category")
    {
        delete globalCategoryMap[globalID];
        ReOrderGlobalMaps(globalCategoryMap); 
    }

    if(globalCategoryType == "subCategory")
    {
        delete globalSubCategoryMap[globalID];
        ReconstructJson("delete"); 
    }

    if(globalCategoryType == "finalCategory")
    {
        delete globalFinalCategoryMap[globalID];
        ReconstructJson("delete"); 
    }

}

function ReOrderGlobalMaps(global)
{
    for(let i = 0; i < Object.keys(global).length; i++)
    {
        global[Object.keys(global)[i]].numbering = i;
    }

    ReconstructJson("delete"); 
}
