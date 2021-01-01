document.addEventListener("DOMContentLoaded", function(){

	// Grab team JSON data
	var teams = parseJson(data)
	var result = parseJson(results)

	// HTML element selections
	var afcRound1Array = document.getElementsByClassName("AFC");
	var afcRound2Array = document.getElementsByClassName("AFC2");
	var afcRound3Array = document.getElementsByClassName("AFC3");
	var nfcRound1Array = document.getElementsByClassName("NFC");
	var nfcRound2Array = document.getElementsByClassName("NFC2");
	var nfcRound3Array = document.getElementsByClassName("NFC3");
	var afcChampion = document.getElementById("AFCSB");
	var nfcChampion = document.getElementById("NFCSB");

	// Stored local version of team seeds
	var afcStorageArray = [];
	var nfcStorageArray = [];

	// Round 1 (qualified teams)
	var afcStorageArray = firstRoundPopulate(afcRound1Array,teams, result.afcRound1)
	var nfcStorageArray = firstRoundPopulate(nfcRound1Array,teams, result.nfcRound1)

	// Round 2 (wild card round)
	secondRoundPopulate(afcRound2Array,afcStorageArray)
	secondRoundPopulate(nfcRound2Array,nfcStorageArray)

	// Round 3 (AFC/NFC Championship)
	thirdRoundPopulate(afcRound3Array, afcStorageArray)
	thirdRoundPopulate(nfcRound3Array, nfcStorageArray)

	// Super Bowl
	superBowlPopulate(afcChampion, afcStorageArray)
	superBowlPopulate(nfcChampion, nfcStorageArray)

	$(function(){
		$(".dropdown-menu").on('click', 'p', function(){

			var dropdownButton = $(this).parent().prev()
			var seed = $(this).attr("seed");

			console.log(seed)

			dropdownButton.text($(this).text());
			dropdownButton.css('background', $(this).css('background'));
			dropdownButton.attr('seed', seed)
		});
	});
});

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

function backwardCheckLogic(seed, dropdownElement){
	const appendDropdown = document.createElement("p"); 
	appendDropdown.setAttribute("seed", seed)
	appendDropdown.setAttribute("class", "drop-item");
	dropdownElement.insertAdjacentElement('afterend', appendDropdown)
	return appendDropdown;
}

function firstRoundPopulate(elementArray, teamsObject, resultObject){
	var storageArray = [];
	for(var i=0; i< elementArray.length; i++){

		// Get the seed for the current html element
		seed = parseInt(elementArray[i].getAttribute("seed"))

		// Get the right team index
		teamObject = binarySearch(teamsObject, resultObject[seed-1])
		storageArray[seed] = teamObject 
		teamStyleLogic(teamObject, elementArray[i])
	}
	return storageArray;
}

function secondRoundPopulate(elementArray,divisionStorage){
	for(var i=0; i< elementArray.length; i++){
		seed = parseInt(elementArray[i].getAttribute("seed"))
		teamStyleLogic(divisionStorage[seed],elementArray[i])
	}
}

function thirdRoundPopulate(elementArray,divisionStorage){
	for(var i=0; i< elementArray.length; i++){
		seedString = elementArray[i].getAttribute("seed")
		seedArray = seedString.split(",")
		for(var j=0; j<seedArray.length; j++){

			if(j == 0){ // No need to append for first option, just change the style
				teamStyleLogic(divisionStorage[seedArray[j]],elementArray[i])
			} else { // every other option must be appended
				var appendedElement = backwardCheckLogic(seedArray[j], elementArray[i]);
				teamStyleLogic(divisionStorage[seedArray[j]],appendedElement)
			}

		}

	}
}

function superBowlPopulate(element, divisionStorage){
	seedString = element.getAttribute("seed")
	seedArray = seedString.split(",")

	for(var j=0; j<seedArray.length; j++){
		if(j == 0){ // No need to append for first option, just change style like round 2
			teamStyleLogic(divisionStorage[seedArray[j]],element)
		} else { // every other option must be appended
			var appendedElement = backwardCheckLogic(seedString[j], element);
			teamStyleLogic(divisionStorage[seedArray[j]],appendedElement)
		}
	}
}



