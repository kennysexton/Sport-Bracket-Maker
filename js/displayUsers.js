var selectorArray = [];
var j =  0;
var successCounter = 0;
var tabLength = 0;


document.addEventListener("DOMContentLoaded", function(){

  // Grab users JSON data
  var userSubmissions = parseJson(userPicks);

  tabLength = Object.keys(userSubmissions).length
  console.log("Number of user tabs: " + tabLength)

  // itirate over keys
  for (i in userSubmissions) { 

    // Create a tab per submission
    $("#myTab").append("<li class='nav-item user'><a class='nav-link' id='"+i+"-tab' data-toggle='tab' href='#"+i+"' role='tab' aria-controls='"+i+"' aria-selected='false'>"+cleanInput(i)+"</a></li>")

    $("#myTabContent").append("<div class='tab-pane fade' id='"+i+"' role='tabpanel' aria-labelledby='"+i+"-tab'><div id='bracket-viewonly-replace-"+i+"' class='text-center'>TODO - spinner on load</div></div>")

    // Populate dropdowns with the previously selected result
    var selector = '#bracket-viewonly-replace-' +i;
    //		console.log("Selector: " + selector)
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
});

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

      //TODO, should this have a catch?? choices must be length 7
      var winnerDivision = userSubmissions[objIndex].charAt(7) 

      choices.each(function(index) {

        var currentSeed = userSubmissions[objIndex].charAt(index) 
        $(this).attr('seed', currentSeed)

        // Remove some classes & attributes
        $(this).removeClass('dropdown-toggle')
        $(this).removeClass('btn')
        $(this).removeAttr('aria-haspopup')
        $(this).removeAttr('data-toggle')

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

        var gameStatus = insertLeaderboardRow(currentSeed,results.games, winnerDivision, index, objIndex)
        console.log(gameStatus)
        $(this).addClass(gameStatus)

      });
    }
  }
}


function getIdFromSelector(selectorString){
  return selectorString.split('-').pop()
}