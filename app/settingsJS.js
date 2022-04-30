
async function UpdateSettingsFile(category, newValue)
{
    globalSettings[category] = newValue;

    UpdateSettingsJson(globalSettings);
    
}

async function UpdateSettingsJson(updatedSettings)
{
    return new Promise(resolve => {

        let status = false; 

		// check its valid json
        if(!isJsonString(JSON.stringify(updatedSettings)))
        {
            console.log("error updating settings as json not valid. Settings not updated");
            resolve(status);
        }

		fs.writeFile(`${globalUserPath}/Documents/MyLocalNotesApp/data/userSettings/settings.txt`, JSON.stringify(updatedSettings), function (err) {
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