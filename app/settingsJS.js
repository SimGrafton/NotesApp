
async function UpdateSettingsFile(category, newValue)
{
    globalSettings[category] = newValue;

    UpdateJson(globalSettings);
    
}

async function UpdateJson(updatedSettings)
{
    return new Promise(resolve => {

        let status = false; 

		fs.writeFile(`app/settings.txt`, JSON.stringify(updatedSettings), function (err) {
			if (err) {
                console.log("An error has occurred opening settings file to update: " + err);
                
                resolve (status);
			}
			else {
                status = true; 
				resolve (status); 
			} 
		})
	})
}