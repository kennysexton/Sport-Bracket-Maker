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

			// Button styling
			dropdownButton.text($(this).text());
			dropdownButton.css('background', $(this).css('background'));
			dropdownButton.attr('seed', seed)


			var round = dropdownButton.attr("round")
			buttonUpdate(seed, round, afcStorageArray, nfcStorageArray);
			checkifAllChociesAreMade();

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
	appendDropdown.setAttribute("temporary", "");
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
		seed = parseInt(elementArray[i].getAttribute("default"))
		teamStyleLogic(divisionStorage[seed],elementArray[i])
		elementArray[i].setAttribute("seed", seed)
	}
}

function thirdRoundPopulate(elementArray,divisionStorage){
	for(var i=0; i< elementArray.length; i++){
		seedString = elementArray[i].getAttribute("default")

		styleAndAppendOptionsIfNeeded(seedString, elementArray[i], divisionStorage)
	}
}

function superBowlPopulate(element, divisionStorage){
	seedString = element.getAttribute("default")

	styleAndAppendOptionsIfNeeded(seedString, element, divisionStorage)
}

function buttonUpdate(seed, round, afcStorageArray, nfcStorageArray){

	if(round.startsWith("A")){
		if(round.endsWith("2")){
			console.log("inside round 2 w/ seed: " + seed)
			// Go to AFC3 relevant object
			var dropdownElement = $(".AFC3[default*='"+seed+"']")
			resetDropdown(dropdownElement.get(0))
			dropdownElement.attr('seed', seed);
			teamStyleLogic(afcStorageArray[seed],dropdownElement.get(0))
		}

		else if(round.endsWith("3")){
			var newSeed = ""

			console.log("inside round 3: " + seed)

			if(seed.length > 1){
				console.error("something is wrong with this seed")
			}
			// Go to AFC3 relevant object
			var dropdownElement = $("#AFCSB")

			var lowerSet = "2,3,6,7";
			var upperSet = "1,4,5";

			//Get the current selected seed
			if(dropdownElement.attr("selectionA") == undefined){
				newSeed = dropdownElement.attr("default")


				if(lowerSet.includes(seed)){ // remove unused 2,3,6,7
					newSeed = replaceUnusedSeeds(newSeed, 'lower');
					newSeed = newSeed.concat(","+seed)
				} else { // is in upper set ([1, 4, 5])
					newSeed = replaceUnusedSeeds(newSeed, 'upper');
					newSeed = seed+",".concat(newSeed)
				}

				console.log("Default final value: " + newSeed)

				// Show that a division final was selected
				dropdownElement.attr("selectionA", seed)

			} else {
				newSeed = dropdownElement.attr("selectionA")


				if(lowerSet.includes(seed)){
					newSeed = replaceUnusedSeeds(newSeed, 'lower');
					newSeed = newSeed.concat(","+seed)
					console.log("lower set override : " + newSeed)
				} else { // is in upper set ([1, 4, 5])
					newSeed = replaceUnusedSeeds(newSeed, 'upper');

					newSeed = seed+",".concat(newSeed)
					console.log("uppder set override: " + newSeed)
				}
				dropdownElement.attr("selectionA", newSeed)
			}

			// Style dropdown to show the 
			resetDropdown(dropdownElement.get(0))
			dropdownElement.attr('seed', newSeed);
			styleAndAppendOptionsIfNeeded(newSeed, dropdownElement.get(0), afcStorageArray)
		}
	}

	else if ( round.startsWith("N")) {
		if(round.endsWith("2")){
			console.log("inside round 2 w/ seed: " + seed)
			// Go to AFC3 relevant object
			var dropdownElement = $(".NFC3[default*='"+seed+"']")
			resetDropdown(dropdownElement.get(0))
			dropdownElement.attr('seed', seed);
			teamStyleLogic(nfcStorageArray[seed],dropdownElement.get(0))
		}

		else if(round.endsWith("3")){
			var newSeed = ""

			console.log("inside round 3: " + seed)

			if(seed.length > 1){
				console.error("something is wrong with this seed")
			}
			// Go to AFC3 relevant object
			var dropdownElement = $("#NFCSB")

			var lowerSet = "2,3,6,7";
			var upperSet = "1,4,5";

			//Get the current selected seed
			if(dropdownElement.attr("selectionN") == undefined){
				newSeed = dropdownElement.attr("default")


				if(lowerSet.includes(seed)){ // remove unused 2,3,6,7
					newSeed = replaceUnusedSeeds(newSeed, 'lower');
					newSeed = newSeed.concat(","+seed)
				} else { // is in upper set ([1, 4, 5])
					newSeed = replaceUnusedSeeds(newSeed, 'upper');
					newSeed = seed+",".concat(newSeed)
				}

				console.log("Default final value: " + newSeed)

				// Show that a division final was selected
				dropdownElement.attr("selectionN", seed)

			} else {
				newSeed = dropdownElement.attr("selectionN")


				if(lowerSet.includes(seed)){
					newSeed = replaceUnusedSeeds(newSeed, 'lower');
					newSeed = newSeed.concat(","+seed)
					console.log("lower set override : " + newSeed)
				} else { // is in upper set ([1, 4, 5])
					newSeed = replaceUnusedSeeds(newSeed, 'upper');

					newSeed = seed+",".concat(newSeed)
					console.log("upper set override: " + newSeed)
				}
				dropdownElement.attr("selectionN", newSeed)
			}

			// Style dropdown to show the 
			resetDropdown(dropdownElement.get(0))
			dropdownElement.attr('seed', newSeed);
			styleAndAppendOptionsIfNeeded(newSeed, dropdownElement.get(0), nfcStorageArray)
		}

	} else { // round = "SB"
		// No action needed.
	}
}


function styleAndAppendOptionsIfNeeded(seedString, element, divisionStorage){
	var seedArray = seedString.split(",")

	for(var j=0; j<seedArray.length; j++){		
		if(j == 0){ // No need to append for first option, just change the style
			teamStyleLogic(divisionStorage[seedArray[j]],element)
			element.setAttribute("seed", seedArray[j])
		} else { // every other option must be appended

			var appendedElement = backwardCheckLogic(seedArray[j], element);
			teamStyleLogic(divisionStorage[seedArray[j]],appendedElement)
		}
	}
}


function resetDropdown(element){
	sibling = element.nextElementSibling

	while(sibling != null && sibling.hasAttribute("temporary") ){
		//    console.log("removing a dropdown options")
		sibling.remove();
		sibling = element.nextElementSibling;
	}
	var defaultSeed = element.getAttribute("default")
	element.setAttribute("seed", defaultSeed)
}


// TODO improve so that you don't need to passs in the tier,  maybe just a set of numbers to replace
function replaceUnusedSeeds(newSeed, tier){

	if(tier == 'upper'){
		newSeed = newSeed.replace(/,/g, '');
		newSeed = newSeed.replace(/1/g, '');
		newSeed = newSeed.replace(/4/g, '');
		newSeed = newSeed.replace(/5/g, '');
	} else { //tier = 'lower'
		//TODO simplify
		newSeed = newSeed.replace(/,/g, '');
		newSeed = newSeed.replace(/2/g, '');
		newSeed = newSeed.replace(/3/g, '');
		newSeed = newSeed.replace(/6/g, '');
		newSeed = newSeed.replace(/7/g, '');
	}

	var buildSeed = ""

	for(var i=0; i<newSeed.length; i++){
		if(i == 0){
			buildSeed += newSeed.substring(i, i+1)
		} else {
			buildSeed +=  "," + newSeed.substring(i, i+1)
		}
		console.log("building " + buildSeed)
	}

	return buildSeed;
}

function checkifAllChociesAreMade(){
	var choices=$(".dropdown-toggle[seed]")

	console.log("Number of choices made: " + choices.length)
	if(choices.length == 11){
		// enable submit
		$('#submit').prop('disabled', false);

		//init results file


	}
}

$(function(){
	$("#submit").on('click', function(){

		var seedList = ""
		var choices=$(".dropdown-toggle[seed]")

		choices.each(function( index ) {
			seedList += $( this ).attr('seed')
			console.log( index + ": " + $( this ).attr('seed') );
		});

		console.log(seedList)
		

	});
});