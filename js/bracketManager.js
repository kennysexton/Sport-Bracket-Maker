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
		// Get the right team index
		teamObject = binarySearch(teams, result.afcRound1[i])
		afcStorageArray[i] = teamObject 
		firstRoundLogic(teamObject, afcRound1Array)
	}

	// NFC Round 1
	for(var i=0; i< nfcRound1Array.length; i++){
		// Get the right team index
		teamObject = binarySearch(teams, result.nfcRound1[i])
		firstRoundLogic(teamObject , nfcRound1Array)
	}

	//Loop through storage array
	for(var i=0; i< afcStorageArray.length; i++){
		console.log(afcStorageArray[i].city)
	}


	// AFC Round 2
	for(var i=0; i< afcRound2Array.length; i++){
		secondRoundLogic(afcStorageArray[i],afcRound2Array)
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

	// Logic used for getting populating first round teams
	function firstRoundLogic(teamObject, divisionArray){

		// Change Box to match teams information
		divisionArray[i].style.background = teamObject.cPrim;
		divisionArray[i].innerText = teamObject.city + " " +  teamObject.name;

		// Line below name with secondary color
		const firstSeedLine = document.createElement("div"); 
		firstSeedLine.setAttribute("id", "line")
		divisionArray[i].appendChild(firstSeedLine); 

		firstSeedLine.style.background = teamObject.cSecn;
	}

	// Logic used for getting populating second round teams
	function secondRoundLogic(teamObject, divisionArray){

		// Change Box to match teams information
		divisionArray[i].style.background = teamObject.cPrim;
		divisionArray[i].innerText = teamObject.city + " " +  teamObject.name;

		// Line below name with secondary color
		const firstSeedLine = document.createElement("div"); 
		firstSeedLine.setAttribute("id", "line")
		divisionArray[i].appendChild(firstSeedLine); 

		firstSeedLine.style.background = teamObject.cSecn;
	}

});


