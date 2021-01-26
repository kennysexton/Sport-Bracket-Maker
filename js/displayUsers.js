var selectorArray = [];
var j =  0;
var successCounter = 0;
var tabLength = 0;


document.addEventListener("DOMContentLoaded", function(){

  // Grab users JSON data
  const Http = new XMLHttpRequest();
  const url='https://express-api-app.herokuapp.com/users';
  Http.open("GET", url);
  Http.send();

  Http.onreadystatechange =function(){
    if (Http.readyState == 4 && Http.status == 200){
      displayUserTabs(Http.responseText)
    } 
  }
});

function displayUserTabs(response){
  userSubmissions = JSON.parse(response)
  console.log(userSubmissions)

  tabLength = Object.keys(userSubmissions).length
  console.log("Number of user tabs: " + tabLength)

  //   itirate over keys
  for(i=0; i< tabLength; i++) { 
    var user = userSubmissions[i];
    var name = user.name
    console.log(user.name)

    // Create a tab per submission
    $("#myTab").append("<li class='nav-item user'><a class='nav-link' id='"+name+"-tab' data-toggle='tab' href='#"+name+"' role='tab' aria-controls='"+name+"' aria-selected='false'>"+cleanInput(name)+"</a></li>")

    $("#myTabContent").append("<div class='tab-pane fade' id='"+name+"' role='tabpanel' aria-labelledby='"+name+"-tab'><div id='bracket-viewonly-replace-"+name+"' class='text-center'>TODO - spinner on load</div></div>")

    // Populate dropdowns with the previously selected result
    var selector = '#bracket-viewonly-replace-' +name;

    selectorArray[j] = selector

    $(selector).load('htmlSegments/bracket.html', function (response, status) {
      //get selector
      if( status == 'success'){
        successCounter++;
      } else {
        console.error("failed to load a bracket in one of the tabs")
      }

      // Run on last success
      populateReadOnlyBracket(userSubmissions)

    });
    j++
  }
}

// Used for displaying users picks
function populateReadOnlyBracket(userSubmissions) {

  // Only run after all load events have passed
  if(successCounter == tabLength){
    for(var i=0; i< selectorArray.length; i++){

      var afcRound1Array = document.getElementsByClassName("AFC");
      var nfcRound1Array = document.getElementsByClassName("NFC");

      // Grab team JSON datas
      var teams = parseJson(data)
      var result = parseJson(results)

      objIndex = getIdFromSelector(selectorArray[i])


      // Round 1 (qualified teams)
      var afcStorageArray = firstRoundPopulate(afcRound1Array,teams, result.afcRound1)
      var nfcStorageArray = firstRoundPopulate(nfcRound1Array,teams, result.nfcRound1)

      var choicesSelect = selectorArray[i] +" button[round]"
      var choices=$(choicesSelect)

      // Check that submissions are in the correct format
      if(userSubmissions[i].picks.length == 8){
        var winnerDivision = userSubmissions[i].picks.charAt(7) 
        } else {
          console.error("User submission: " + objIndex + " is not the correct length")
        }


      choices.each(function(index) {

        var currentSeed = userSubmissions[i].picks.charAt(index) 
        $(this).attr('seed', currentSeed)

        // Remove some classes & attributes
        $(this).removeClass('dropdown-toggle')
        $(this).removeClass('btn')
        $(this).removeAttr('aria-haspopup')
        $(this).removeAttr('data-toggle')
        $(this).removeClass('btn-danger')
        $(this).removeClass('btn-primary')

        // AFC
        if(index == 3){
          if(winnerDivision == 'A'){
            teamStyleLogic(afcStorageArray[currentSeed], $(this).get(0))
          } else {
            teamStyleLogic(nfcStorageArray[currentSeed], $(this).get(0))
          }
        } else if (index == 0 || index == 2 || index == 5){ //AFC
          teamStyleLogic(afcStorageArray[currentSeed], $(this).get(0))
        } else {
          teamStyleLogic(nfcStorageArray[currentSeed], $(this).get(0))
        }

        // Testing out a new solution
//        var gameStatus = insertLeaderboardRow(currentSeed,results.games, winnerDivision, index, objIndex)
//        $(this).addClass(gameStatus)

      });
    }
  }
}


function getIdFromSelector(selectorString){
  return selectorString.split('-').pop()
}