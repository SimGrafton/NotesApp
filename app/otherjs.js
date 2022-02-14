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