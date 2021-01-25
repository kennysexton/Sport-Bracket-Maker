// grab the the team info that matches the results value. 
// credit - wOxxOm (https://codereview.stackexchange.com/questions/144821/binary-search-on-string-in-alphabetical-order)
function binarySearch(haystack, needle) {
	var a = 0;
	var b = haystack.length - 1;
	if (needle < haystack[0].city || needle > haystack[b].city) {
		return {};
	}
	while (a < b - 1) {
		var c = (a + b) / 2 |0;
		if (needle < haystack[c].city) {
			b = c;
		} else {
			a = c;
		}
	}
	//TODO check for this edge case.  multiple teams play in the same city edge case
	if(haystack[a].city == 'Los Angeles' || haystack[a].city == 'New York'){
		return haystack[a]
	} else if (haystack[a].city === needle){
		return haystack[a]
	} else if (haystack[a+1].city === needle) {
		return haystack[a+1]
	} else {
		console.error("Something went wrong in binary search when searching for - " + needle)
		return {}
	}
}

// Grab json files
function parseJson(jsonObject){
	try {
		return jsonObject
	} catch (e) {
		console.error("Failed to parse JSON: " + e )
		return null
	}
}

function cleanInput(string){
	let newString = ""
	// remove dashes
	newString = string.replace(/-/g, ' ');
	//remove underscores
	newString = string.replace(/_/g, ' ');
	return newString
}

// Gives a percentage as a string
function getPercentage(part, total){
  return Math.round(part / total * 100) + "%";
}