var selectorArray = [];
var j =  0;
var successCounter = 0;
var successCounter = 0;

var league = getLeague();

document.addEventListener("DOMContentLoaded", function(){

  // Kick of request for users
  loadUserTabs(league);
});

// Clear previous data on reload
function reloadUserTabs(){
  // Start with zeros out variables
  selectorArray = [];
  j =  0;
  successCounter = 0;
  successCounter = 0;

  // Remove previous tabs
  $('#home-tab').siblings().remove();
  loadUserTabs(league);
}

// Get users in default order
function loadUserTabs(league){
  // Grab users JSON data
  const Http = new XMLHttpRequest();
  const url='https://express-api-app.herokuapp.com/users';
  Http.open("GET", url, true);
  Http.send();

  Http.onreadystatechange =function(){
    if (Http.readyState == 4 && Http.status == 200){
      displayUserTabs(Http.responseText)
    } 
  }
}

// Logic for appending HTML
function displayUserTabs(response){
  userSubmissions = JSON.parse(response)
  console.log(userSubmissions)

  tabLength = Object.keys(userSubmissions).length
  console.log("Number of user tabs: " + tabLength)

  //   itirate over keys
  for(i=0; i< tabLength; i++) { 
    var user = userSubmissions[i];
    var name = user.name
    var nameNoSpaces = cleanInput(name)

    // Create a tab per submission
    $("#myTab").append("<a class='nav-link nav-item user' id='"+nameNoSpaces+"-tab' data-toggle='tab' href='#"+nameNoSpaces+"' role='tab' aria-controls='"+nameNoSpaces+"' aria-selected='false'>"+name+"</a>")

    $("#myTabContent").append("<div class='tab-pane fade' id='"+nameNoSpaces+"' role='tabpanel' aria-labelledby='"+nameNoSpaces+"-tab'><div id='bracket-viewonly-replace-"+nameNoSpaces+"' class='text-center'></div></div>")

    // Populate dropdowns with the previously selected result
    var selector = '#bracket-viewonly-replace-' +nameNoSpaces;

    selectorArray[j] = selector

    $(selector).load(`htmlSegments/${league}bracket.html`, function (response, status) {
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
  loadNav()
}

// Used for displaying users picks
function populateReadOnlyBracket(userSubmissions) {

  // Only run after all load events have passed
  if(successCounter == tabLength){
    for(var i=0; i< selectorArray.length; i++){

      var aRound1Array = document.getElementsByClassName("A1");
      var bRound1Array = document.getElementsByClassName("B1");

      // Grab team JSON datas
      var teams = parseJson(data)
      var result = parseJson(results)

      objIndex = getIdFromSelector(selectorArray[i])

      // Round 1 (qualified teams)
      var aStorageArray = firstRoundPopulate(aRound1Array,teams, result.aRound1)
      var bStorageArray = firstRoundPopulate(bRound1Array,teams, result.bRound1)

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
            teamStyleLogic(aStorageArray[currentSeed], $(this).get(0))
          } else {
            teamStyleLogic(bStorageArray[currentSeed], $(this).get(0))
          }
        } else if (index == 0 || index == 2 || index == 5){ //AFC
          teamStyleLogic(aStorageArray[currentSeed], $(this).get(0))
        } else {
          teamStyleLogic(bStorageArray[currentSeed], $(this).get(0))
        }

        // Show if picks are correct or wrong
        switch(userSubmissions[i].style[index]){
          case 1: $(this).addClass('correct')
            break;
          case 2: $(this).addClass('wrong')
            break;
          default: //not played - do nothing
            break;
        }
      });
    }
  }
}

function getIdFromSelector(selectorString){
  return selectorString.split('-').pop()
}