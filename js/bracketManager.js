document.addEventListener("DOMContentLoaded", function(){

  // Grab team JSON data
  var teams = parseJson(data)
  var result = parseJson(results)
  var afcRound1Array = document.getElementsByClassName("AFC");
  var nfcRound1Array = document.getElementsByClassName("NFC");

  console.log("teams - " + teams)
  console.log("results - " + result)

  for(var i=0; i< afcRound1Array.length; i++){
    // Get the right team index
    teamObject = binarySearch(teams, result.afcRound1[i])
    firstRoundLogic(teamObject , i)
  }

  for(var i=0; i< nfcRound1Array.length; i++){
    // Get the right team index
    teamIndex = binarySearch(teams, result.afcRound1[i])
    firstRoundLogic(teamObject , i)
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

    console.log("haystack - " + haystack)
    console.log("Needle - " + needle)
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

    } else if (haystack[a].city === needle){
      return haystack[a]
    } else if (haystack[a+1] === needle) {
      return haystack[a+1]
    } else {
      console.error("Something went wrong in binary search")
      return {}
    }
  }

  // Logic used for getting populating first round teams
  function firstRoundLogic(teamObject , i){

    // Change Box to match teams information
    afcRound1Array[i].style.background = teamObject.cPrim;
    afcRound1Array[i].innerText = teamObject.city + " " +  teamObject.name;

    // Line below name with secondary color
    const firstSeedLine = document.createElement("div"); 
    firstSeedLine.setAttribute("id", "line")
    afcRound1Array[i].appendChild(firstSeedLine); 

    firstSeedLine.style.background = teamObject.cSecn;
  }

});
