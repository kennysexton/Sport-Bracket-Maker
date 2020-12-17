document.addEventListener("DOMContentLoaded", function(){

	// Grab team JSON data
	var teams = parseJson(data)
	var result = parseJson(results)
	var afcRound1Array = document.getElementsByClassName("AFC");
	var nfcRound1Array = document.getElementsByClassName("NFC");

	var afcRound2Array = document.getElementsByClassName("AFC2");

	var afcStorageArray = [];

	console.log("AFC Round 1 - " + afcRound1Array.length)
	console.log("NFC Round 1 - " + nfcRound1Array .length)

	// AFC Round 1
	for(var i=0; i< afcRound1Array.length; i++){

		// Get the seed for the current html element
		seed = parseInt(afcRound1Array[i].getAttribute("seed"))

		// Get the right team index
		teamObject = binarySearch(teams, result.afcRound1[seed-1])
		afcStorageArray[seed] = teamObject 
		teamStyleLogic(teamObject, afcRound1Array[i])
	}

	// NFC Round 1
	for(var i=0; i< nfcRound1Array.length; i++){

		// Get the seed for the current html element
		seed = parseInt(nfcRound1Array[i].getAttribute("seed"))

		// Get the right team index
		teamObject = binarySearch(teams, result.nfcRound1[seed-1])
		teamStyleLogic(teamObject , nfcRound1Array[i])
	}

	// AFC Round 2
	for(var i=0; i< afcRound2Array.length; i++){
		seed = parseInt(afcRound2Array[i].getAttribute("seed"))
		teamStyleLogic(afcStorageArray[seed],afcRound2Array[i])
	}


	$(function(){

		$(".dropdown-menu").on('click', 'p', function(){

			$(".btn:first-child").text($(this).text());
			$(".btn:first-child").val($(this).text());

		});

	});


});


// Grab json files
function parseJson(jsonObject){
	try {
		return jsonObject
	} catch (e) {
		console.error("Failed to parse JSON: " + e )
		return null
	}
}

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

// Logic used for getting populating team buttons
function teamStyleLogic(teamObject, divisionArrayElement){

	// Change Box to match teams information
	divisionArrayElement.style.background = teamObject.cPrim;
	divisionArrayElement.innerText = teamObject.city + " " +  teamObject.name;

	// Line below name with secondary color
	const firstSeedLine = document.createElement("div"); 
	firstSeedLine.setAttribute("id", "line")
	divisionArrayElement.appendChild(firstSeedLine); 

	firstSeedLine.style.background = teamObject.cSecn;
}

