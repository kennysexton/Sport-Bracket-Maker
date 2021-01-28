document.addEventListener("DOMContentLoaded", function(){

  // If results
  if(0){
    leaderBoardLogic()
    $('#submissionForm').hide()
  } else {
    newBracketLogic()
  }
});

function newBracketLogic(){
  $('#bracket-replace').load('htmlSegments/bracket.html', function() {

    // Grab team JSON datas
    var teams = parseJson(data)
    var result = parseJson(results)

    var afcRound1Array = document.getElementsByClassName("AFC");
    var afcRound3Array = document.getElementsByClassName("AFC3");
    var afcRound4Array = document.getElementsByClassName("AFC4");
    var nfcRound1Array = document.getElementsByClassName("NFC");
    var nfcRound3Array = document.getElementsByClassName("NFC3");
    var nfcRound4Array = document.getElementsByClassName("NFC4");
    var afcChampion = document.getElementById("AFCSB");
    var nfcChampion = document.getElementById("NFCSB");

    // Stored local version of team seeds
    var afcStorageArray = [];
    var nfcStorageArray = [];

    // Remove spinner
    $('#spinner').remove();

    // Round 1 (qualified teams)
    var afcStorageArray = firstRoundPopulate(afcRound1Array,teams, result.afcRound1)
    var nfcStorageArray = firstRoundPopulate(nfcRound1Array,teams, result.nfcRound1)

    // Round 3 (Division round)
    multipleOptionsPopulate(afcRound3Array, afcStorageArray)
    multipleOptionsPopulate(nfcRound3Array, nfcStorageArray)

    // Round 4 (AFC/NFC Championship)
    multipleOptionsPopulate(afcRound4Array, afcStorageArray)
    multipleOptionsPopulate(nfcRound4Array, nfcStorageArray)

    // Super Bowl
    superBowlPopulate(afcChampion, afcStorageArray)
    superBowlPopulate(nfcChampion, nfcStorageArray)

    $(function(){
      $(".dropdown-menu").on('click', 'p', function(){

        var dropdownButton = $(this).parent().prev()
        var seed = $(this).attr("seed");
        var division = $(this).attr("division");

        // Button styling
        dropdownButton.text($(this).text());
        dropdownButton.css('background', $(this).css('background'));
        dropdownButton.attr('seed', seed)
        if(division != null){
          dropdownButton.attr('division', division)
        }

        var round = dropdownButton.attr("round")
        buttonUpdate(seed, round, afcStorageArray, nfcStorageArray);
        checkifAllChociesAreMade();
      });
    });
  });
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

function multipleOptionsPopulate(elementArray,divisionStorage){
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
    if(round.endsWith("3")){

      // Go to AFC3 relevant object
      var dropdownElement = $(".AFC4[default*='"+seed+"']")
      resetDropdown(dropdownElement.get(0))
      dropdownElement.attr('seed', seed);
      teamStyleLogic(afcStorageArray[seed],dropdownElement.get(0))

    } else if(round.endsWith("4")){

      var dropdownElement = $('#AFCSB')
      resetDropdown(dropdownElement.get(0))
      dropdownElement.attr('seed', seed);
      teamStyleLogic(afcStorageArray[seed],dropdownElement.get(0))
    }
  }	else if ( round.startsWith("N")) {
    if(round.endsWith("3")){
      // Go to NFC3 relevant object
      var dropdownElement = $(".NFC4[default*='"+seed+"']")
      resetDropdown(dropdownElement.get(0))
      dropdownElement.attr('seed', seed);
      teamStyleLogic(nfcStorageArray[seed],dropdownElement.get(0))

    } else if(round.endsWith("4")){
      var dropdownElement = $('#NFCSB')
      resetDropdown(dropdownElement.get(0))
      dropdownElement.attr('seed', seed);
      teamStyleLogic(nfcStorageArray[seed],dropdownElement.get(0))
    }

  } else { // round = "SB"
    // No action needed.
  }
}

function styleAndAppendOptionsIfNeeded(seedString, element, divisionStorage){
  var seedArray = seedString.split(",")
  var needsDivision = false;

  if(element.hasAttribute("id")){
    needsDivision = true;

  }

  for(var j=0; j<seedArray.length; j++){		
    if(j == 0){ // No need to append for first option, just change the style
      teamStyleLogic(divisionStorage[seedArray[j]],element)
      element.setAttribute("seed", seedArray[j])

    } else { // every other option must be appended
      var appendedElement = backwardCheckLogic(seedArray[j], element);
      teamStyleLogic(divisionStorage[seedArray[j]],appendedElement)

      if(needsDivision){
        appendedElement.setAttribute("division", (element.getAttribute("id").substring(0, 1)))
      }
    }
    // Superbowl only logic

  }
}

function resetDropdown(element){
  sibling = element.nextElementSibling

  while(sibling != null && sibling.hasAttribute("temporary") ){
    sibling.remove();
    sibling = element.nextElementSibling;
  }
  var defaultSeed = element.getAttribute("default")
  element.setAttribute("seed", defaultSeed)
}

function replaceUnusedSeeds(newSeed, tier){

  if(tier == 'upper'){
    newSeed = newSeed.replace(/,|1|4|5/g, '');
  } else { //tier = 'lower'
    newSeed = newSeed.replace(/,|2|3|6|7/g, '');
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

  if(choices.length == 7){
    // enable submit
    $('#submit').prop('disabled', false);

  }
}

function setPicksInput(){

  var seedList = ""
  var choices=$(".dropdown-toggle[seed]")

  choices.each(function( index ) {
    seedList += $( this ).attr('seed')
  });

  // Get if the picked winner was AFC or NFC
  var winner = $("button[round='SB']").attr('division')
  seedList += winner
  
  // Set picks inputs
  $('#picks').val(seedList)
  
}