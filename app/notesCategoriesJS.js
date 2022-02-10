// Add all categories to sidebar menu

// `<a href="#" class="btnUpdate ml-3 text-dark small" style="text-decoration: none !important; display: block;">- To do</a>`
// `<a href="#" class="btnDelete ml-3 text-dark small" style="text-decoration: none !important; display: block;">- C++</a>`

LoadCategoriesIntoSidebar(); 

async function LoadCategoriesIntoSidebar()
{
    await GetCategories().then(function(response){
        console.log(response); 
        for(let i of response)
        let count = 0; 
        {
            // Add to sidebar
            AddCategory(i,`cat${count}`);

            //Add event listener
            

        }
    })

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

                // Parse return data
                let parsedNotes = JSON.parse(notes); 

                // Iterate through and get categories
				for(let k in parsedNotes)
				{
					categories.push(k);
				}

				resolve (categories); 
			} 
		})
	})
}

function AddCategory(category, classname)
{
    $("#collapseNotes").append(`<a href="#" class="${classname} ml-3 text-dark small" style="text-decoration: none !important; display: block;">- ${category}</a>`);
}