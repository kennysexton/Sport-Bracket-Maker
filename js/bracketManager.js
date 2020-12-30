document.addEventListener("DOMContentLoaded", function(){

  // Grab team JSON data
  var teams = parseJson(data)
  var result = parseJson(results)
  var afcRound1Array = document.getElementsByClassName("AFC");
  var afcRound2Array = document.getElementsByClassName("AFC2");
  var afcRound3Array = document.getElementsByClassName("AFC3");

  var nfcRound1Array = document.getElementsByClassName("NFC");

  var afcChampion = document.getElementById("AFCSB");
  var nfcChampion = document.getElementById("NFCSB");


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

  // AFC Round 3 (semi final)
  for(var i=0; i< afcRound3Array.length; i++){
    seedString = afcRound3Array[i].getAttribute("seed")

    //Show all options unless previous has been picked
    if(seedString.length == 1){
      seed = parseInt(seedString)
      teamStyleLogic(afcStorageArray[seed],afcRound3Array[i])
    } else { // Multiple seeds can obtain this spot
      seedArray = seedString.split(",")
      for(var j=0; j<seedArray.length; j++){
        if(j == 0){ // No need to append for first option, just change style like round 2
          teamStyleLogic(afcStorageArray[seedArray[j]],afcRound3Array[i])
        } else { // every other option must be appended
          backwardCheckLogic(seedArray[j], afcRound3Array[i]);         
        }

      }

    }
  }

  // Super Bowl



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

function backwardCheckLogic(seed, dropdownElement){
  const appendDropdown = document.createElement("p"); 
  appendDropdown.setAttribute("seed", seed)
  appendDropdown.setAttribute("class", "drop-item AFC3");
  dropdownElement.insertAdjacentElement('afterend', appendDropdown)
}



