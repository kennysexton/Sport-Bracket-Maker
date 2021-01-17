var total = 0, correct = 0, wrong = 0;

function leaderBoardLogic(){
  $('#bracket-replace').load('htmlSegments/leaderboard.html', function() {
    $('#home-tab').text("Leaderboard")
  });	
}

function insertLeaderboardRow(userPick, resultPick, winnerDivision, index, user){
  var style = ""
  
  if(resultPick[index] != 0){ // If zero - game has not been played
    if(index == 3){ //super bowl
      if(resultPick[7] == winnerDivision && userPick == resultPick[index]){
        correct++;
        style = "correct"
      } else {
        wrong++;
        style = "wrong"
      }
    }
    else if(userPick == resultPick[index]){
      correct++;
      style = "correct"
    } else {
      wrong++;
      style = "wrong"
    }
    total++;
  }

  // Publish results for user.  and move on
  if(index == 6){

    // Insert a row in the leaderboard table
    insertLeaderboardRowCode(user, correct, wrong, total)

    // Reset counters
    correct = 0;
    wrong = 0;
    total = 0;
  }
  return style
}

function insertLeaderboardRowCode(user, correct, wrong, total){
  var userClean = cleanInput(user)

  $("#table-append").append("<tr><th scope='row'>"+userClean+"</th><td>"+correct+"</td><td>"+wrong+"</td><td>"+total+"</td><td>"+getPercentage(correct, total)+"</td></tr>")
}