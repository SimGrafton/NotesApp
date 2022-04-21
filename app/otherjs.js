var exports = {}; // To resolve export not defined issue

// Global useful functions
function FillDataHTML(divID, html)
{
    $(`#${divID}`).html(html);
}

function AfterDataHTML(divID, html)
{
    $(`#${divID}`).after(html);
}

function AppendDataHTML(divID, html)
{
    $(`#${divID}`).append(html);
}

function AddDataHTML(html)
{
	// Meeds to dynamically count child elements of mainContent
	var count = $(".mainContent").children().length;

    $(`.mainContent`).append(html);
}

// Refresh the content in the boxes on the main index page
function RefreshIndexData()
{

	$(".mainContent").html(""); 

}

function OutputError(text)
{
    AddDataHTML(`User Selection invalid error: ${text}`); 
}

function OpenAtLocation(location, id)
{
    if(location == "category")
    {

    }

    if(location == "subCategory")
    {
        
    }

    if(location == "finalCategory")
    {
        
    }

    if(location == "div")
    {
        
    }
}

function RemoveNumberSuffix(string)
{
    let original = string.substr(0, string.length - 2);
    let key = string.substr(string.length - 2);
    key = key.replace(/[0-9]/g, '');
    return original + key; 
}

function MakeID(length, stringToID) {

    let string = RemoveSpaces(stringToID); 
    let result           = '';
    //let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = string.length;
    for ( var i = 0; i < length; i++ ) {
        result += string.charAt(Math.floor(Math.random() * 
        charactersLength));
    }

    return result;
}

// Removes all spaces and symbols from a string
function RemoveSpaces(str){
    return str.replace(/[^a-zA-Z]/g, ""); 
}

async function GetJSONFromFile(file)
{
    return new Promise(resolve => {

		fs.readFile(file, 'utf8', function (err, notes) {
			if (err) {
				console.log("An error has occurred opening json file: " + err);
			}
			else {
                // Parse return data and save to global variable
                parsedJSON = JSON.parse(notes); 

				resolve (parsedJSON); 
			} 
		})
	})
}