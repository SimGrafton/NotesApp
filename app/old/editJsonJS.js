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
                        // If it's a new final category it wont appear in parsedNotes so need to add a blank {} in place. Will also throw error
                        // so catching it here
                        let thing;
                        try{
                            thing = parsedNotes[category[0]][subCategory[0]][finalCategory[0]]; 
                        }
                        catch(e)
                        {

                        }
                        
                        if(thing == undefined)
                        {
                            newBuild[category[2]][subCategory[2]][finalCategory[2]] = {};
                            
                        }else{
                            newBuild[category[2]][subCategory[2]][finalCategory[2]] = parsedNotes[category[0]][subCategory[0]][finalCategory[0]];
                        }

                        numberCheck += 1; 

                    }
                    

                }

            }
            
        }

    }

    if(action != "delete" && action != "adding" )
    {
        if(numberCheck != globalCategoryNumberCheck){
            return alert(`Count of categories before move (${globalCategoryNumberCheck}) and after move (${numberCheck})are not equal, change has not been made`);
        }
        else{
            //Update the json
            await UpdateJsonFile(newBuild).then(function(){
    
                let type = globalCategoryType;
                let catID = globalCategoryID;
                let subCatID = globalSubCategoryID; 
    
            }); 
        }
    } else
    {
        await UpdateJsonFile(newBuild).then(function(){
    
            let type = globalCategoryType;
            let catID = globalCategoryID;
            let subCatID = globalSubCategoryID; 

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

    console.log("Deleting from Json");
    
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

function AddNewCategoryToJson(newCategory, ID)
{

    if(globalCategoryType == "topCategory")
    {
            number = Object.keys(globalCategoryMap).length; 

            // Add entry to globalMap
            globalCategoryMap[ID] = {
                categoryName: newCategory,
                ID : ID,
                categoryType : "category",
                subCategoryIDs :[],
                numbering : number
            }; 

            // Add entry to globalNameMap
            globalNameMap[newCategory] = {
                categoryID: ID,
                categoryType : "category",
                numbering : number
            }; 

            ReconstructJson("adding");

    } else if(globalCategoryType == "category")
    {
        let number = globalCategoryMap[globalID].subCategoryIDs.length;
        
        globalCategoryMap[globalID].subCategoryIDs.push(ID);

        // Add entry to globalMap
        globalSubCategoryMap[ID] = {
            categoryName: newCategory,
            categoryType : "subCategory",
            ID : ID, 
            subCategoryIDs :[],
            parentCategoryID : globalID, 
            numbering : number
        }; 

        globalNameMap[newCategory] = {
            categoryID: ID,
            categoryType : "subCategory",
            numbering : number
        }; 

        ReconstructJson("adding");

    } else if(globalCategoryType == "subCategory")
    {
        let number = globalSubCategoryMap[globalID].subCategoryIDs.length;

        globalSubCategoryMap[globalID].subCategoryIDs.push(ID);

        // Add entry to globalMap
        globalFinalCategoryMap[ID] = {
            categoryName: newCategory,
            categoryType: "finalCategory",
            ID : ID, 
            parentCategoryID: globalID,
            parentParentCategoryID: globalSubCategoryMap[globalID].parentCategoryID,
            numbering: number
        };

        globalNameMap[newCategory] = {
            categoryID: ID,
            categoryType: "finalCategory",
            numbering: number
        };

        ReconstructJson("adding");
    
    }
    else {
        console.log("globalCategoryType not recognised")
    }


}

function EditContent(newContent)
{
    // Set number before edit
    globalCategoryNumberCheck = Object.keys(globalCategoryMap).length + Object.keys(globalSubCategoryMap).length + Object.keys(globalFinalCategoryMap).length;

    // Add to parsed Notes
    let category = globalCategoryMap[globalContentCategoryID].categoryName;
    let subCategory = globalSubCategoryMap[globalContentSubCategoryID].categoryName;
    let finalCategory = globalFinalCategoryMap[globalContentFinalCategoryID].categoryName;

    // THIS WILL NOT WORK FOR MULTIPLE PARAGRAPHS, SO EACH PARAGRAPH NEEDS A UNIQUE TITLE and will need to pass it

    parsedNotes[category][subCategory][finalCategory][`${globalDivCategory}`] = newContent;

    ReconstructJson(); 

}

async function AddNewContentToJson(newHeader, newText, parentID)
{

    // Set number before edit for check of category numbers
    globalCategoryNumberCheck = Object.keys(globalCategoryMap).length + Object.keys(globalSubCategoryMap).length + Object.keys(globalFinalCategoryMap).length;
    
    // get last 2 digits and select only numbers
    let num = parentID.substr(parentID.length - 2);
    num = num.replace( /^\D+/g, '');

    // Needs to reconstruct the content so that it's in place
    let category = globalCategoryMap[globalContentCategoryID].categoryName;
    let subCategory = globalSubCategoryMap[globalContentSubCategoryID].categoryName;
    let finalCategory = globalFinalCategoryMap[globalContentFinalCategoryID].categoryName;

    let array = {}; 
    let j = 0; 
    let keys = Object.keys(parsedNotes[category][subCategory][finalCategory]);
    for(let i in parsedNotes[category][subCategory][finalCategory])
    {
        if(j == num + 1)
        {
            array[newHeader] = newText; 
        }
        else
        {             
            array[keys[j]] = parsedNotes[category][subCategory][finalCategory][keys[j]]; 
        }

        j++; 
    }

    parsedNotes[category][subCategory][finalCategory] = array;

    ReconstructJson(); 

}